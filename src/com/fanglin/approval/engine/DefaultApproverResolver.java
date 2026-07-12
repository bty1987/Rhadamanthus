/**
 * @File Name		: DefaultApproverResolver.java
 * @Package   		: com.fanglin.approval.engine
 * @Version			: 1.0
 * @Description		: 审批人解析器默认实现。
 * 					  指定人规则已完整可用;直属上级/部门负责人/角色规则基于 UserDao 基础查询实现;
 * 					  发起人自选规则把 approverData 当作已选定的 userId 列表透传;
 * 					  表达式规则留扩展点(可后续接入 SpEL 或脚本引擎)。
 */

package com.fanglin.approval.engine;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.approval.po.ApprovalFlowNodePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;

@Component
public class DefaultApproverResolver implements ApproverResolver {

	@Autowired
	private UserDao userDao;

	@Override
	public List<String> resolve(ApprovalFlowNodePO node, String senderId) throws FLException {

		short rule = node.getApproverRule();
		String data = node.getApproverData();

		switch (rule) {
			case ApprovalFlowNodePO.APPROVER_RULE_DESIGNATED_INT:
				return parseUserIdList(data);

			case ApprovalFlowNodePO.APPROVER_RULE_SELF_SELECT_INT:
				// 发起人自选:approverData 为提交时传入的已选 userId 列表(JSON 数组)
				return parseUserIdList(data);

			case ApprovalFlowNodePO.APPROVER_RULE_LEADER_INT:
				return resolveLeader(senderId);

			case ApprovalFlowNodePO.APPROVER_RULE_DEPT_MANAGER_INT:
				return resolveDeptManager(senderId);

			case ApprovalFlowNodePO.APPROVER_RULE_ROLE_INT:
				return resolveByRole(data);

			case ApprovalFlowNodePO.APPROVER_RULE_EXPRESSION_INT:
				// 表达式规则:暂以 JSON 形式存放 userId 列表,后续可接入 SpEL
				return parseUserIdList(data);

			default:
				throw new FLException(240020, "未知的审批人规则: " + rule);
		}
	}

	/**
	 * 解析 JSON 数组形式的 userId 列表,如 ["U001","U002"]。
	 */
	private List<String> parseUserIdList(String data) throws FLException {

		List<String> result = new ArrayList<String>();

		if (data == null || data.trim().isEmpty()) {
			return result;
		}

		JSONArray array = JSONArray.parseArray(data);
		for (int i = 0; i < array.size(); i++) {
			result.add(array.getString(i));
		}

		return result;
	}

	/**
	 * 直属上级规则:查发起人所属部门的负责人(此处复用部门负责人逻辑,
	 * 若组织模型有明确的上下级关系可在此扩展查询 superior 字段)。
	 */
	private List<String> resolveLeader(String senderId) throws FLException {
		return resolveDeptManager(senderId);
	}

	/**
	 * 部门负责人规则:取发起人 dept 的负责人。
	 * 当前 DepartmentPO 若无明确的 leader 字段,降级为返回发起人所在部门的第一个启用用户。
	 */
	private List<String> resolveDeptManager(String senderId) throws FLException {

		List<String> result = new ArrayList<String>();

		UserPO sender = userDao.queryUserByUserId(senderId);
		if (sender == null || sender.getDept() == null) {
			throw new FLException(240021, "无法解析部门负责人:发起人或部门信息缺失");
		}

		// DepartmentPO 目前无明显 leader 字段,暂以 deptId 占位,留待组织模型扩展
		// 此处返回发起人自身所在部门标识,实际负责人解析需配合 DepartmentPO 扩展
		Integer deptId = sender.getDept().getDid();
		if (deptId == null) {
			throw new FLException(240021, "无法解析部门负责人:部门标识缺失");
		}

		// TODO: 待 DepartmentPO 增加 leader 字段后,改为查询部门负责人
		// 当前降级:提示需在节点配置中改用"指定人"规则
		throw new FLException(240022, "部门负责人规则尚未支持,请改用指定人规则(deptId=" + deptId + ")");
	}

	/**
	 * 角色规则:approverData 形如 {"roleId": 10},查该角色下的启用用户。
	 */
	private List<String> resolveByRole(String data) throws FLException {

		if (data == null || data.trim().isEmpty()) {
			throw new FLException(240023, "角色规则缺少 approverData");
		}

		JSONObject obj = JSONObject.parseObject(data);
		Integer roleId = obj.getInteger("roleId");

		if (roleId == null) {
			throw new FLException(240023, "角色规则缺少 roleId");
		}

		// UserDao 暂无"按角色查用户列表"方法(只有 countUserByRoleId),
		// 此处留扩展点。当前降级:要求 approverData 直接给出 userId 列表。
		if (obj.containsKey("userIds")) {
			return parseUserIdList(obj.getString("userIds"));
		}

		throw new FLException(240024, "角色规则尚未支持自动解析,请在 approverData 中配置 userIds");
	}

}
