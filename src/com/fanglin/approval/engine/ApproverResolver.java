/**
 * @File Name		: ApproverResolver.java
 * @Package   		: com.fanglin.approval.engine
 * @Version			: 1.0
 * @Description		: 审批人解析器。把节点配置的 approverRule + approverData 解析成具体的 userId 列表。
 * 					  支持规则:指定人 / 直属上级 / 部门负责人 / 角色 / 发起人自选 / 表达式。
 */

package com.fanglin.approval.engine;

import java.util.List;

import com.fanglin.approval.po.ApprovalFlowNodePO;
import com.fanglin.core.interceptor.FLException;

/**
 * 审批人解析器。
 * <p>输入:节点定义(含 approverRule + approverData)+ 发起人上下文
 * <p>输出:该节点的审批人 userId 列表(并签/或签/会签可能多人)
 */
public interface ApproverResolver {

	/**
	 * 解析节点审批人。
	 *
	 * @param node      节点定义
	 * @param senderId  发起人 userId(用于"直属上级""部门负责人"等相对规则)
	 * @return 审批人 userId 列表(至少1个,空表示无可用审批人,调用方应抛异常)
	 */
	public List<String> resolve(ApprovalFlowNodePO node, String senderId) throws FLException;

}
