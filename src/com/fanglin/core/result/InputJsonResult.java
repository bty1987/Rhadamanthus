/**
 * @File Name		: InputJsonResult.java
 * @Package   	: com.fanglin.core.result
 * @Version		: 1.0
 * @Date			: 2026-11-04
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 参数转换失败(workflow拦截器打回input)时的JSON兜底结果。
 * 				  Action未执行业务, errorCode保持默认0会被前端判为成功,
 * 				  此处在序列化前补置约定错误码(默认110040), 复用前端统一弹错链,
 * 				  消除"No result defined for action ... and result input"异常。
 */

package com.fanglin.core.result;

import org.apache.struts2.json.JSONResult;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.util.ValueStack;

public class InputJsonResult extends JSONResult {

	private static final long serialVersionUID = 1L;

	private String errorCode;

	private String errorMsg;

	@Override
	public void execute(ActionInvocation invocation) throws Exception {

		ValueStack stack = invocation.getStack();

		Object current = stack.findValue("errorCode");

		// 仅当业务未显式设置错误码时补默认(转换失败路径errorCode恒为默认0)
		if (current == null || "0".equals(String.valueOf(current))) {
			if (errorCode != null && !"".equals(errorCode)) {
				stack.setValue("errorCode", Integer.valueOf(errorCode));
			}
			if (errorMsg != null && !"".equals(errorMsg)) {
				stack.setValue("errorMsg", errorMsg);
			}
		}

		super.execute(invocation);
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

}
