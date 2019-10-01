package com.yspay.utils;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.RandomUtil;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.*;

/**
 * 工具类
 *
 * @author chang
 */
public class StringUtils {

    /**
     * 判断字符数组是否为空
     */
    public static boolean areNotEmpty(String... values) {
        boolean result = true;
        if (values == null || values.length == 0) {
            result = false;
        } else {
            for (String value : values) {
                result &= !isEmpty(value);
            }
        }
        return result;
    }

    /**
     * 把数组所有元素排序，并按照“参数=参数值”的模式用“&”字符拼接成字符串
     *
     * @param params 需要排序并参与字符拼接的参数组
     * @return 拼接后字符串
     */
    public static String createLinkString(Map<String, String> params) {

        List<String> keys = new ArrayList<String>(params.keySet());
        Collections.sort(keys);

        String prestr = "";

        for (int i = 0; i < keys.size(); i++) {
            String key = keys.get(i);
            String value = params.get(key);

            if (i == keys.size() - 1) {
                prestr = prestr + key + "=" + value;
            } else {
                prestr = prestr + key + "=" + value + "&";
            }
        }

        return prestr;
    }

    /**
     * 判断字符串是否为空
     * <ul>
     * <li>isEmpty(null) = true</li>
     * <li>isEmpty("") = true</li>
     * <li>isEmpty("   ") = true</li>
     * <li>isEmpty("abc") = false</li>
     * </ul>
     *
     * @param value 目标字符串
     * @return true/false
     */
    public static boolean isEmpty(String value) {
        int strLen;
        if (value == null || (strLen = value.length()) == 0) {
            return true;
        }
        for (int i = 0; i < strLen; i++) {
            if ((Character.isWhitespace(value.charAt(i)) == false)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 为null或者全空白或者空白字符串时返回false
     *
     * @param focus
     * @return
     */
    public static boolean hasLength(String focus) {
        if (focus == null) {
            return false;
        }
        if (focus.length() == 0) {
            return false;
        }
        if (focus.trim().length() == 0) {
            return false;
        }
        return true;
    }

    public static boolean hasLength(Object focus) {
        if (focus == null) {
            return false;
        }
        return hasLength(focus.toString());
    }

    /**
     * 将对象转换成json
     *
     * @param object
     * @return json
     */
    public static String toJson(Object object) {
        Gson gson = new GsonBuilder().disableHtmlEscaping().create();
        String json = gson.toJson(object);
        return json;
    }


    /**
     * 生成订单号，格式:yyyyMMddHHmmss+一个随机大写字母+一个随机数（0-9）+一个随机大写字母+一个随机数（0-9）
     *
     * @param offset 偏移天数，正数向未来偏移，负数向历史偏移
     * @return
     */
    public static String getNo(int offset, int digits) {

        return getNo("", offset, digits);
    }

    public static String getNo(String pre, int offset, int digits) {
        Date date = DateUtil.date();
        String dateString = DateUtil.format(DateUtil.offsetDay(date, offset), "yyyyMMddHHmmss");
        pre = StringUtils.hasLength(pre) ? pre : "";

        String no = pre + dateString + RandomUtil.randomInt(digits);
        return no;
    }
}
