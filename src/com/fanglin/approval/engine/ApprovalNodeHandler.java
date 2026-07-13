/**
 * @File Name		: ApprovalNodeHandler.java
 * @Package   		: com.fanglin.approval.engine
 * @Version			: 1.0
 * @Description		: 审批业务处理器 SPI。每个业务审批类型(对应 ApprovalPO.type)实现一个处理器,
 * 					  替代 ApprovalServiceImpl 中的巨型 switch-case 分发。
 * 					  <p>兼容性:未实现此接口的业务类型仍走 ApprovalServiceImpl 中的遗留 switch,
 * 					  因此可渐进迁移,不影响现有流程。
 */

package com.fanglin.approval.engine;

import java.util.Map;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.core.interceptor.FLException;

/**
 * 审批业务处理器接口。
 * <p>方法签名刻意与现有 {@code ApprovalXxxServiceImpl.approveForXxx(ApprovalPO)} / {@code refuseForXxx(ApprovalPO)}
 * 保持一致,使既有业务 Service 仅需继承 {@link ApprovalNodeAdapter} + 声明 {@link #businessType()}
 * 即可接入新分发机制,业务方法体无需改动。
 */
public interface ApprovalNodeHandler {

	/**
	 * 声明本处理器负责的业务审批类型,取值对应 {@link ApprovalPO} 中的 {@code APPROVAL_TYPE_*} 常量。
	 */
	short businessType();

	/**
	 * 提交审批时的前置校验/数据准备。
	 * <p>formData 为前端提交的表单数据(fieldKey→fieldValue),已由引擎存入 approvalFormData 表。
	 * 业务可在此做额外校验(如金额上限),或补充业务上下文。无表单时 formData 为空 Map。
	 */
	void onPreSubmit(ApprovalPO approvalPO, Map<String, String> formData) throws FLException;

	/**
	 * 审批通过时的后置业务处理(如生成合同、退款入账等)。
	 */
	void onApprove(ApprovalPO approvalPO) throws FLException;

	/**
	 * 审批拒绝时的后置业务处理(如回滚前置状态)。
	 */
	void onRefuse(ApprovalPO approvalPO) throws FLException;

}
