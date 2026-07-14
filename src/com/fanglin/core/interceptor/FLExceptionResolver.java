/**
 * @File Name		: FLExceptionResolver.java
 * @Package   	: com.fanglin.core.interceptor
 * @Version		: 1.0
 * @Date			: 2026-07-14
 * @Copyright	: Copyright Creators 2014
 * @Describing	: 统一异常解析。把异常按类型转成 errorCode/errorMsg,
 *                通过 OGNL 回写到 Action ValueStack。
 *                供 CommonInterceptor / LoginInterceptor / AccessInterceptor 共用,
 *                消除原三段式 catch 逻辑在三个拦截器里各复制一份的重复。
 */

package com.fanglin.core.interceptor;

import org.hibernate.exception.LockAcquisitionException;

import com.opensymphony.xwork2.ActionInvocation;

public final class FLExceptionResolver {

	private FLExceptionResolver() {}

	/** 数据冲突码:数据库行锁冲突时返回 */
	public static final int CODE_DATA_CONFLICT = -2;

	/** 系统兜底码:未预期异常统一返回 */
	public static final int CODE_SYSTEM_ERROR = 110000;

	/** 数据冲突消息 */
	public static final String MSG_DATA_CONFLICT = "数据冲突,请重新再试!";

	/** 系统兜底消息 */
	public static final String MSG_SYSTEM_ERROR = "系统繁忙,请稍后重试";

	/**
	 * 把异常按类型解析,回写 errorCode/errorMsg 到 Action ValueStack。
	 *
	 * 分三类:
	 *   1. {@link LockAcquisitionException} —— 数据冲突,返回 CODE_DATA_CONFLICT
	 *   2. {@link FLException}             —— 业务异常,原样透传 code/errorMessage
	 *   3. 其它 Exception                   —— 兜底 CODE_SYSTEM_ERROR
	 *
	 * 本方法仅负责分类与回写,不记日志。调用方在返回 true(兜底分支)时
	 * 自行调用 LogUtils.logging,以便保留各自不同的日志签名(如 AccessInterceptor
	 * 额外带 userId/ip)。
	 *
	 * @param invocation  Action 调用上下文
	 * @param e           被捕获的异常
	 * @return true 表示落入兜底分支(需调用方记日志);false 表示业务/数据冲突异常(无需记日志)
	 */
	public static boolean resolve(ActionInvocation invocation, Throwable e) {

		boolean systemError;

		try {
			if (e instanceof LockAcquisitionException) {
				invocation.getStack().setValue("errorCode", String.valueOf(CODE_DATA_CONFLICT));
				invocation.getStack().setValue("errorMsg", MSG_DATA_CONFLICT);
				systemError = false;
			} else if (e instanceof FLException) {
				FLException fe = (FLException) e;
				invocation.getStack().setValue("errorCode", String.valueOf(fe.getCode()));
				invocation.getStack().setValue("errorMsg", fe.getErrorMessage());
				systemError = false;
			} else {
				invocation.getStack().setValue("errorCode", String.valueOf(CODE_SYSTEM_ERROR));
				invocation.getStack().setValue("errorMsg", MSG_SYSTEM_ERROR);
				systemError = true;
			}
		} catch (Exception ignore) {
			// 解析本身绝不再抛,避免循环异常
			systemError = true;
		}

		return systemError;
	}

}
