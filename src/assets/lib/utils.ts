import {Notification} from "@arco-design/web-vue";
import html2canvas from "html2canvas";
import type {LocationQueryValue} from "vue-router";
import * as XLSX from "xlsx";

export const fullMap = (o: Record<string, string>) => {
  return !Object.values(o).filter(x => !x).length
}

export const assertNotEmpty = <T>(data: T | null | undefined, message: string): T => {
  if (data) return data
  Notification.error(message)
  throw Error(message)
}

export class DateParser {
  date

  constructor(raw_data: number | string | null = null) {
    if (typeof raw_data === "number" && raw_data < 1e12) {
      raw_data *= 1e3
    }
    this.date = raw_data ? new Date(raw_data) : new Date()
  }

  seconds() {
    return this.date.getSeconds()
  }

  hours() {
    return this.date.getHours()
  }

  minutes() {
    return this.date.getMinutes()
  }

  day() {
    return this.date.getDate()
  }

  month() {
    return this.date.getMonth() + 1
  }

  year() {
    return this.date.getFullYear()
  }

  //16:25
  hoursMinutes() {
    return this.hours().toString().padStart(2, "0") + ":" + this.minutes().toString().padStart(2, "0")
  }

  //10-21
  monthDay() {
    return this.month().toString().padStart(2, "0") + "-" + this.day().toString().padStart(2, "0")
  }

  //10-21 16:25
  monthDayHoursMinutes() {
    return this.monthDay() + " " + this.hoursMinutes()
  }

  //2021-10-21
  yearMonthDay() {
    return this.year() + "-" + this.monthDay()
  }

  all() {
    return this.yearMonthDay() + " " + this.hoursMinutes()
  }

  smart() {
    if (this.year() === new Date().getFullYear()) {
      return this.monthDayHoursMinutes()
    }
    return this.all()
  }
}

export const dateDelta = (value: number) => {
  const nowDate = new DateParser()
  const valueDate = new DateParser(value)
  let str = ""
  if (nowDate.date > valueDate.date) {
    if (nowDate.year() > valueDate.year()) str += nowDate.year() - valueDate.year() + "年"
    if (nowDate.month() > valueDate.month()) str += nowDate.month() - valueDate.month() + "月"
    if (nowDate.day() > valueDate.day()) str += nowDate.day() - valueDate.day() + "天"
    if (nowDate.hours() > valueDate.hours()) str += nowDate.hours() - valueDate.hours() + "小时"
    if (nowDate.minutes() > valueDate.minutes()) str += nowDate.minutes() - valueDate.minutes() + "分钟"
  } else {
    if (nowDate.year() < valueDate.year()) str += valueDate.year() - nowDate.year() + "年"
    if (nowDate.month() < valueDate.month()) str += valueDate.month() - nowDate.month() + "月"
    if (nowDate.day() < valueDate.day()) str += valueDate.day() - nowDate.day() + "天"
    if (nowDate.hours() < valueDate.hours()) str += valueDate.hours() - nowDate.hours() + "小时"
    if (nowDate.minutes() < valueDate.minutes()) str += valueDate.minutes() - nowDate.minutes() + "分钟"
  }
  return str
}
export const datetime = (value: number) => {
  const nowDate = new DateParser()
  const valueDate = new DateParser(value)
  if (nowDate.year() > valueDate.year()) return valueDate.yearMonthDay()
  if (nowDate.monthDay() > valueDate.monthDay()) return valueDate.monthDay() + " " + valueDate.hoursMinutes()
  if (nowDate.hours() > valueDate.hours()) return `${nowDate.hours() - valueDate.hours()}小时前`
  if (nowDate.minutes() > valueDate.minutes()) return `${nowDate.minutes() - valueDate.minutes()}分钟前`
  if (nowDate.seconds() > valueDate.seconds()) return `${nowDate.seconds() - valueDate.seconds()}秒前`
  return "刚刚"
}

export const open_url = (url: string) => window.open(url)

export const proxy_url = (url: string) => {
  try {
    const url_obj = new URL(url)
    return `https://proxy.realhuhu.com${url_obj.pathname}?host=${url_obj.protocol}//${url_obj.hostname}&referer=https://www.bilibili.com/`
  } catch {
    return ""
  }
}

export const number_to_color = (n: number, avoid_white?: boolean) => {
  if (avoid_white && n === 16777215) {
    return "#888888"
  }
  return `#${n.toString(16).padStart(6, "0")}`
}

export const privilege_image = (privilege_type: 1 | 2 | 3) => {
  let url = ""
  switch (privilege_type) {
    case 3:
      url = "https://i0.hdslb.com/bfs/live/143f5ec3003b4080d1b5f817a9efdca46d631945.png"
      break
    case 2:
      url = "https://i0.hdslb.com/bfs/live/98a201c14a64e860a758f089144dcf3f42e7038c.png"
      break
    case 1:
      url = "https://i0.hdslb.com/bfs/live/ffcd832b5d7b84ea851cb8156ec0a71940439511.png"
      break
  }
  return proxy_url(url)
}

export const flat_query = (query: LocationQueryValue | LocationQueryValue[]): LocationQueryValue => {
  return Array.isArray(query) ? query[0] : query
}

export const build_params = (
  params: Record<string, null | string | number | string[] | number[] | Date>,
  fields: (keyof Partial<typeof params>)[]
): Record<(typeof fields)[number], string | number> => {
  const res: Record<(typeof fields)[number], string | number> = {}
  for (const key of fields) {
    if (!params[key]) continue

    if (typeof params[key] === "string" || typeof params[key] === "number") {
      res[key] = params[key] as string | number
    } else if (params[key] instanceof Date) {
      res[key] = new Date(+(params[key] as Date) + 8 * 3600 * 1000).toISOString().slice(0, 23)
    } else if (params[key] instanceof Array) {
      res[key] = (params[key] as (string | number)[]).join(",")
    }
  }
  return res
}

export const axis_formatter = (value: number) => {
  if (value > 9e5) {
    return (value / 1e6).toFixed(1).toString() + "m"
  } else if (value > 1e3) {
    return (value / 9e2).toFixed(1).toString() + "k"
  }
  return value.toString()
}

export const time_delta = (timestamp1: string, timestamp2: string | null) => {
  const date1 = new DateParser(timestamp1).date
  const date2 = new DateParser(timestamp2).date
  return Math.abs((date1.getTime() - date2.getTime()) / (60 * 60 * 1000))
}

export const div2img = (div: HTMLDivElement) => {
  const head = div.querySelectorAll(".card-head")[0]
  const paste = head.querySelectorAll(".paste")[0]
  paste.setAttribute("style", "visibility: hidden; opacity: 0");

  html2canvas(div, {
    backgroundColor: "transparent",
    allowTaint: true,
    useCORS: true,
    scrollY: 0,
    scrollX: 0,
    scale: 2 // 处理模糊问题
  }).then(canvas => {
    canvas.toBlob(function (blob) {
      if (!blob) {
        Notification.warning("生成图片失败")
        paste.removeAttribute("style")
        return
      }
      const item = new ClipboardItem({"image/png": blob});

      navigator.clipboard.write([item]).then(function () {
        paste.removeAttribute("style")
        Notification.success("图像已复制到剪贴板");
      }, function (err) {
        paste.removeAttribute("style")
        Notification.warning("复制失败:", err);
      });
    }, "image/png");
  })
}

export const field_formatter = <T extends {}>(
  items: T[],
  map: Partial<Record<keyof T, string>>
): Record<string, string | number | boolean | null>[] => {
  return items.map(item => {
    const result = {};
    for (const oldKey in map) {
      const newKey = map[oldKey]
      // eslint-disable-next-line
      // @ts-ignore
      result[newKey] = item[oldKey];
    }
    return result;
  });
};


export const to_excel = (data: Record<string, Record<string, string | number | boolean | null>[]>, name?: string) => {
  const wb = XLSX.utils.book_new()
  for (const name in data) {
    if (!data[name].length) continue;
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(data[name], {header: Object.keys(data[name][0])}),
      name
    )
  }

  XLSX.writeFile(wb, `${name || new Date().getTime()}.xlsx`)
}

export const unpack = <T>(values: T[], periods: string[], process?: (value: T) => T): [string, T][] => values.map((value, index) => [periods[index], process ? process(value) : value])
