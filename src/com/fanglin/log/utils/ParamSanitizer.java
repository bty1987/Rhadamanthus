/**
 * @File Name		: ParamSanitizer.java
 * @Package 		: com.fanglin.log.utils
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Copyright		: Copyright Creators
 * @Describing		: 请求参数脱敏工具，用于 actionLog.params 字段入库前的安全处理
 *
 *  设计目标：
 *    - 避免 actionLog.params 沦为新的明文敏感信息池
 *    - 命中敏感字段名（password/phone/idCard/token 等）直接替换为 ***
 *    - 控制参数长度，超过 maxLen 截断，避免单条日志过大拖慢查询
 *    - 不抛任何异常：脱敏失败时返回 "[sanitize-error]" 兜底，绝不阻塞主流程
 */

package com.fanglin.log.utils;

import java.util.Enumeration;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import com.alibaba.fastjson.JSON;

public final class ParamSanitizer {

	private ParamSanitizer(){
		// 工具类，禁止实例化
	}

	/** 敏感字段名小写集合：命中即整体替换为 MASK。 */
	private static final Set<String> SENSITIVE_KEYS = new HashSet<String>();
	/** 敏感字段名的正则（不区分大小写）：phone、idCard、身份证、密码、token 类。 */
	private static final Pattern SENSITIVE_PATTERN;

	/** 脱敏占位符。 */
	private static final String MASK = "***";

	/** 默认最大长度（字符数）。 */
	public static final int DEFAULT_MAX_LEN = 2000;

	static {
		SENSITIVE_KEYS.add("password");
		SENSITIVE_KEYS.add("oldpwd");
		SENSITIVE_KEYS.add("newpwd");
		SENSITIVE_KEYS.add("pwd");
		SENSITIVE_KEYS.add("token");
		SENSITIVE_KEYS.add("accesstoken");
		SENSITIVE_KEYS.add("authentication");
		SENSITIVE_KEYS.add("secret");
		SENSITIVE_KEYS.add("cardno");
		SENSITIVE_KEYS.add("bankcard");
		SENSITIVE_KEYS.add("idcardno");
		SENSITIVE_KEYS.add("bankno");

		// 手机号 / 身份证号 / 银行卡号字段命名通常含 phone/mobile/idcard/identity 等
		SENSITIVE_PATTERN = Pattern.compile(
				".*(phone|mobile|idcard|identity|bankcard|bankno|cardno|certno).*",
				Pattern.CASE_INSENSITIVE);
	}

	/**
	 * 从 HttpServletRequest 提取参数并脱敏为 JSON 字符串。
	 *
	 * <p>仅采集 query/form 参数，不读取 body（避免消耗 InputStream 影响后续 Action）。
	 * authentication cookie 不在此采集（已作为独立列 userId 存储）。
	 *
	 * @param request    当前 servlet 请求
	 * @param maxLen     返回字符串最大长度，超出尾部截断并追加 "...[truncated]"
	 * @return 脱敏后的 JSON 字符串；request 为 null 返回 null；任何异常返回 "[sanitize-error]"
	 */
	public static String sanitize(HttpServletRequest request, int maxLen){
		if (request == null) return null;
		try {
			Enumeration<String> names = request.getParameterNames();
			if (names == null || !names.hasMoreElements()) return null;

			Map<String, String> map = new LinkedHashMap<String, String>();
			while (names.hasMoreElements()){
				String name = names.nextElement();
				if (name == null) continue;

				// authentication 已独立记录到 userId，不重复采集
				if ("authentication".equalsIgnoreCase(name)) continue;

				String value = request.getParameter(name);
				map.put(name, maskIfNeeded(name, value));
			}
			String json = JSON.toJSONString(map);
			return truncate(json, maxLen);
		} catch (Throwable t) {
			// 脱敏过程出现任何异常都返回兜底串，绝不影响主业务
			return "[sanitize-error]";
		}
	}

	/**
	 * 对单个字段值脱敏。命中敏感字段名或敏感正则则返回 ***。
	 * 非敏感字段值原样返回。
	 */
	public static String maskIfNeeded(String fieldName, String value){
		if (value == null) return null;
		if (fieldName == null) return value;

		String lower = fieldName.toLowerCase();
		if (SENSITIVE_KEYS.contains(lower)) return MASK;
		if (SENSITIVE_PATTERN.matcher(lower).matches()){
			// 手机号/身份证等部分脱敏：保留前 3 后 4，其余打码
			return maskPartial(value);
		}
		return value;
	}

	/**
	 * 部分脱敏：长度 > 7 时保留前 3 后 4，其余用 * 替换。
	 * 例：13812345678 -> 138****5678
	 *     110101199001011234 -> 110***********1234
	 */
	public static String maskPartial(String value){
		int len = value.length();
		if (len <= 7) return MASK; // 太短直接全掩码，避免泄露
		StringBuilder sb = new StringBuilder(len);
		sb.append(value.substring(0, 3));
		for (int i = 0; i < len - 7; i++) sb.append('*');
		sb.append(value.substring(len - 4));
		return sb.toString();
	}

	private static String truncate(String s, int maxLen){
		if (maxLen <= 0 || s == null || s.length() <= maxLen) return s;
		return s.substring(0, maxLen) + "...[truncated]";
	}

	/**
	 * 登录账号脱敏（Phase 8 新增）。
	 *
	 * <p>loginId 可能是手机号（11 位数字）或用户名（字母数字）：
	 * <ul>
	 *   <li>手机号（11 位纯数字）：保留前 3 后 4，中间打码。例：13812345678 → 138****5678</li>
	 *   <li>用户名（非手机号）：原样返回（用户名本身不是个人信息，无需脱敏）</li>
	 *   <li>null/空：原样返回</li>
	 * </ul>
	 *
	 * <p>设计权衡：登录日志表可被运维查询，手机号属于个人信息，
	 * 必须脱敏落库以满足合规要求。用户名通常是工号/拼音，不属于敏感信息。
	 */
	public static String maskLoginId(String loginId){
		if (loginId == null || loginId.length() == 0) return loginId;
		// 判断是否手机号：11 位纯数字，1 开头
		if (loginId.length() == 11 && loginId.startsWith("1")){
			boolean allDigit = true;
			for (int i = 0; i < 11; i++){
				if (!Character.isDigit(loginId.charAt(i))){
					allDigit = false;
					break;
				}
			}
			if (allDigit){
				return loginId.substring(0, 3) + "****" + loginId.substring(7);
			}
		}
		return loginId;
	}

}
