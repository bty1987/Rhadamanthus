package com.fanglin.approval.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalCurrentService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.dingding.service.ApprovalService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;

@Service("approvalCurrentService")
@Transactional(readOnly = true)
public class ApprovalCurrentServiceImpl implements ApprovalCurrentService {

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ApprovalService approvalDDService;

	@Autowired
	private UserDao userDao;

	@Autowired
	private ApprovalDao approvalDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForAddReduce(String sender, String code, String forms, String rule, int company) throws FLException {

		JSONArray form = JSONArray.parseArray(forms);

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(rule);

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

		approvalDDService.initiateApproval(code, sender, StringUtils.join(approvers, ","), null, null, form, company);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForPosition(String userId, String code, String forms, String rule, String comment, int company) throws FLException {

		JSONArray form = JSONArray.parseArray(forms);

		UserPO userPO = userDao.queryUserByUserId(userId);

		String userReceiver = rule.split(",")[rule.split(",").length - 1];
		UserPO Receiver = userDao.queryUserByUserId(userReceiver);

		if (userPO.getDept().getManager() == null) {
			throw new FLException(270003, "获取人员信息失败");
		}

		String processinstanceid = approvalDDService.initiateApproval(code, userId, rule, null, null, form, company);

		approvalPOToCommon(userPO, Receiver, comment, processinstanceid, ApprovalPO.APPROVAL_TYPE_HR_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_CONTENTS_MANIFESTDB_STR, "", company);

		return 0;
	}

	public ApprovalPO approvalPOToCommon(UserPO userPO, UserPO Receiver, String comment, String processinstanceid, short type, short status, String contents, String indent, int company) {

		ApprovalPO approvalPO = new ApprovalPO();

		approvalPO.setReceiver(Receiver);
		approvalPO.setSender(userPO);
		approvalPO.setIdent(indent);
		approvalPO.setType(type);
		approvalPO.setStatus(status);
		approvalPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		approvalPO.setContents(contents);
		approvalPO.setComment(comment);
		approvalPO.setProcessinstanceid(processinstanceid);
		approvalPO.setCompany(company);

		approvalDao.save(approvalPO);

		return approvalPO;
	}

}
