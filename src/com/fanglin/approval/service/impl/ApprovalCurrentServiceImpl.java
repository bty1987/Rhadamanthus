package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalCurrentService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.dingding.service.ApprovalService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;

@Service("approvalCurrentService")
@Transactional(readOnly = true)
public class ApprovalCurrentServiceImpl implements ApprovalCurrentService {

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationAdditionDao decorationAdditionDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private ApprovalService approvalDDService;
	
	@Autowired
	private UserDao userDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForAddReduce(String sender, Map<String, String> args, int company) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(args.get("orderId"));

		List<String> approvers = new ArrayList<String>();

		UserPO designer = decorationPO.getDesigner();

		if (designer != null && designer.getStatus() == UserPO.STATUS_DISABLE_INT) {

			UserPO manager = designer.getDept().getManager();

			if (manager != null && manager.getStatus() == UserPO.STATUS_DISABLE_INT) {
				UserPO director = manager.getDept().getManager();

				if (director != null && director.getStatus() != UserPO.STATUS_DISABLE_INT) {
					approvers.add(director.getUserId());
				}
			} else if (manager != null) {
				approvers.add(manager.getUserId());
			}
		} else if (designer != null) {
			approvers.add(designer.getUserId());
		}

		UserPO quoter = decorationPO.getQuoter();

		if (quoter != null) {
			approvers.add(quoter.getUserId());
		}

		if (approvers.size() == 0) {
			throw new FLException(270003, "获取人员信息失败");
		}

		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(args.get("orderId"));

		Map<String, Object> values = new HashMap<String, Object>();
		values.put("装修订单", args.get("orderId"));
		values.put("楼盘地址", args.get("address"));
		values.put("设计部", decorationAdditionPO.getDesignDepartment());
		values.put("设计师", decorationAdditionPO.getDesigner());
		values.put("施工进度", args.get("schedule"));
		values.put("结款时间", args.get("paymentTime"));

		List<JSONObject> forms = approvalDDService.getForms(values);

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig(ApprovalPO.APPROVAL_SYSTEMCONFIG_INCREASE_OR_DECREASE_STR,company);

		approvalDDService.initiateApproval(systemConfigPO.getValue(), sender, StringUtils.join(approvers, ","), null, null, forms, company);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForResignation(String sender,Map<String, String> args, int company) throws FLException {
		
		UserPO senderPO = userDao.queryUserByUserId(sender);
		
		if(senderPO.getDept().getManager() == null){
			throw new FLException(270003, "获取人员信息失败");
		}
		
		Map<String, Object> values = new HashMap<String, Object>();
		values.put("实际申请人", args.get("sender"));
		values.put("入职日期", args.get("entryTime"));
		values.put("最后工作日", args.get("lastTime"));
		values.put("离职原因", args.get("reason"));
		values.put("离职原因备注", args.get("comment"));
		
		List<JSONObject> forms = approvalDDService.getForms(values);
		
		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig(ApprovalPO.APPROVAL_SYSTEMCONFIG_RESIGNATION_STR,company);
		
		approvalDDService.initiateApproval(systemConfigPO.getValue(), sender, senderPO.getDept().getManager().getUserId(), null, null, forms, company);
		
		return 0;
	}

}
