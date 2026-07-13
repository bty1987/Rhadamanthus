/**
 * @File Name		: ApprovalNodeAdapter.java
 * @Package   		: com.fanglin.approval.engine
 * @Version			: 1.0
 * @Description		: 审批业务处理器适配器(空实现)。
 * 					  <p>实现者继承本类,只需覆盖需要的方法(businessType + onApprove/onRefuse/onPreSubmit),
 * 					  不需要的方法默认空实现。避免 Java 8 default 关键字在 IDE 编译级别 1.7 下报错。
 */

package com.fanglin.approval.engine;

import java.util.Map;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.core.interceptor.FLException;

public abstract class ApprovalNodeAdapter implements ApprovalNodeHandler {

	@Override
	public void onPreSubmit(ApprovalPO approvalPO, Map<String, String> formData) throws FLException {
	}

	@Override
	public void onApprove(ApprovalPO approvalPO) throws FLException {
	}

	@Override
	public void onRefuse(ApprovalPO approvalPO) throws FLException {
	}

}
