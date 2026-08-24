/**
 * @File Name		: ApprovalDecorationBelongServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalDecorationBelongDao;
import com.fanglin.approval.dao.ApprovalDecorationBelongItemDao;
import com.fanglin.approval.po.ApprovalDecorationBelongItemPO;
import com.fanglin.approval.po.ApprovalDecorationBelongPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalDecorationBelongService;
import com.fanglin.approval.vo.ApprovalDecorationBelongItemVO;
import com.fanglin.approval.vo.ApprovalDecorationBelongVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerChanceOrderDao;
import com.fanglin.customer.dao.CustomerSourceRecordDao;
import com.fanglin.customer.po.CustomerChanceOrderPO;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerSourceRecordPO;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.dingding.service.DingTalkApprovalService;
import com.fanglin.information.dao.MessageQueuingDao;
import com.fanglin.information.po.MessageCueuingPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalDecorationBelongService")
@Transactional(readOnly = true)
public class ApprovalDecorationBelongServiceImpl implements ApprovalDecorationBelongService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalDecorationBelongDao approvalDecorationBelongDao;

	@Autowired
	private ApprovalDecorationBelongItemDao approvalDecorationBelongItemDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationBelongDao decorationBelongDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private UserDao userDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private DecorationAdditionDao decorationAdditionDao;

	@Autowired
	private DingTalkApprovalService approvalService;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private MessageQueuingDao messageQueuingDao;

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private CustomerChanceOrderDao customerChanceOrderDao;

	@Autowired
	private CustomerSourceRecordDao customerSourceRecordDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForDecorationBelong(ApprovalVO approvalVO, ApprovalDecorationBelongVO approvalDecorationBelongVO, List<ApprovalDecorationBelongItemVO> approvalDecorationBelongItemVOs, String userId, int company, String code, String forms) throws FLException {

		StringBuffer oldBelongUserName = new StringBuffer();
		StringBuffer oldBelongRate = new StringBuffer();
		StringBuffer newBelongUserName = new StringBuffer();
		StringBuffer newBelongRate = new StringBuffer();

		int rateCount = 0;
		int defaultCount = 0;

		String orderId = approvalDecorationBelongVO.getOrderId();
		Short belongType = approvalDecorationBelongVO.getBelongType();

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_DECORATION_BELONG_INT, orderId);

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		List<Short> unstatus = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT });
		List<Short> belongTypes = Arrays.asList(new Short[] { DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.BELONGTYPE_SALESMAN_INT });

		if (!unstatus.contains(decorationPO.getStatus())) {
			throw new FLException(140011, "订单已签订不可修改归属信息");
		}

		if (!belongTypes.contains(belongType)) {
			throw new FLException(140014, "订单归属类型错误");
		}

		List<DecorationBelongPO> decorationBelongPOs = decorationBelongDao.queryDecorationBelong(orderId, belongType, DecorationBelongPO.STATUS_INVALID_INT);

		for (DecorationBelongPO decorationBelongPO : decorationBelongPOs) {
			UserPO belongUserPO = decorationBelongPO.getBelonger();

			oldBelongUserName.append(belongUserPO.getCurrentName());
			oldBelongUserName.append(",");

			oldBelongRate.append(Arith.div(decorationBelongPO.getRate(), 1000.0));
			oldBelongRate.append(",");
		}

		for (ApprovalDecorationBelongItemVO approvalDecorationBelongItemVO : approvalDecorationBelongItemVOs) {

			UserPO userPO = userDao.queryUserByUserId(approvalDecorationBelongItemVO.getUserId());

			if (userPO == null) {
				throw new FLException(190005, "人员不存在");
			}

			newBelongUserName.append(userPO.getCurrentName());
			newBelongUserName.append(",");

			newBelongRate.append(Arith.div(approvalDecorationBelongItemVO.getRate(), 1000.0));
			newBelongRate.append(",");

			rateCount = Arith.add(rateCount, approvalDecorationBelongItemVO.getRate());

			if (DecorationBelongPO.DEFAULTFLAG_TRUE_INT == approvalDecorationBelongItemVO.getDefaultFlag()) {
				defaultCount++;
			}
		}

		if (rateCount != 1000) {
			throw new FLException(140016, "订单归属人员比例和不为1");
		}

		if (defaultCount != 1) {
			throw new FLException(140017, "订单归属需一个默认人员");
		}

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		String content = String.format("装修单号:%s,类型:%s,现归属:%s比例:%s修改为归属:%s比例:%s", orderId, (approvalDecorationBelongVO.getBelongType() == 0 ? "设计" : approvalDecorationBelongVO.getBelongType() == 1 ? "业务" : "全部"), oldBelongUserName.toString(), oldBelongRate.toString(), newBelongUserName.toString(), newBelongRate.toString());

		approvalPO = new ApprovalPO().init(sender, receiver, orderId, orderId, ApprovalPO.APPROVAL_TYPE_DECORATION_BELONG_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalDecorationBelongPO approvalDecorationBelongPO = new ApprovalDecorationBelongPO();

		BeanUtil.copyProperties(approvalDecorationBelongVO, approvalDecorationBelongPO);
		approvalDecorationBelongPO.setAid(approvalPO.getAid());

		approvalDecorationBelongDao.save(approvalDecorationBelongPO);

		for (ApprovalDecorationBelongItemVO approvalDecorationBelongItemVO : approvalDecorationBelongItemVOs) {

			ApprovalDecorationBelongItemPO approvalDecorationBelongItemPO = new ApprovalDecorationBelongItemPO();

			BeanUtil.copyProperties(approvalDecorationBelongItemVO, approvalDecorationBelongItemPO);

			approvalDecorationBelongItemPO.setBuid(userDao.queryUserByUserId(approvalDecorationBelongItemVO.getUserId()).getUid());
			approvalDecorationBelongItemPO.setAdbId(approvalDecorationBelongPO.getAdbId());
			approvalDecorationBelongItemPO.setBdid(approvalDecorationBelongItemVO.getBdid());
			approvalDecorationBelongItemPO.setBrid(approvalDecorationBelongItemVO.getBrid());

			approvalDecorationBelongItemDao.save(approvalDecorationBelongItemPO);
		}

		messageService.sendMessage(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), approvalPO.getContents(), MessagePO.TYPE_SEND_APPROVAL_INT, company);

		if (code != null && !"".equals(code)) {
			String piid = approvalService.initiateApproval(code, userId, null, null, null, JSONArray.parseArray(forms), company);

			approvalPO.setPiid(piid);

			approvalDao.update(approvalPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForDecorationBelong(ApprovalPO approvalPO) throws FLException {

		ApprovalDecorationBelongPO approvalDecorationBelongPO = approvalDecorationBelongDao.queryApprovalDecorationBelongByAId(approvalPO.getAid());

		if (approvalDecorationBelongPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		String orderId = approvalDecorationBelongPO.getOrderId();
		Short belongType = approvalDecorationBelongPO.getBelongType();
		short mergeFlag = approvalDecorationBelongPO.getMergeFlag();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		List<DecorationBelongPO> decorationBelongPOs = decorationBelongDao.queryDecorationBelong(orderId, belongType, DecorationBelongPO.STATUS_INVALID_INT);

		// 捕获失效人员的ccid
		Long invalidCcid = null;
		if (decorationBelongPOs != null && !decorationBelongPOs.isEmpty()) {
			invalidCcid = decorationBelongPOs.get(0).getCcid();
		}

		if (mergeFlag == 1) {
			// 合尺模式：将现有有效归属的rate从1000改为500，保留有效状态
			for (DecorationBelongPO decorationBelongPO : decorationBelongPOs) {
				decorationBelongPO.setRate(500);
				decorationBelongDao.update(decorationBelongPO);
			}
		} else {
			// 替换模式：将现有有效归属置为失效
			for (DecorationBelongPO decorationBelongPO : decorationBelongPOs) {
				decorationBelongPO.setStatus(DecorationBelongPO.STATUS_EFFCTIVE_INT);
				decorationBelongDao.update(decorationBelongPO);
			}
		}

		List<ApprovalDecorationBelongItemPO> approvalDecorationBelongItemPOs = approvalDecorationBelongItemDao.queryApprovalDecorationBelongItemByAobId(approvalDecorationBelongPO.getAdbId());

		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(orderId);

		if (mergeFlag != 1) {
			if (belongType == DecorationBelongPO.BELONGTYPE_DESIGN_INT) decorationAdditionPO.clearDesign();
			else if (belongType == DecorationBelongPO.BELONGTYPE_SALESMAN_INT) decorationAdditionPO.clearSales();
		}

		for (ApprovalDecorationBelongItemPO approvalDecorationBelongItemPO : approvalDecorationBelongItemPOs) {

			UserPO userPO = userDao.get(approvalDecorationBelongItemPO.getbuid());

			DepartmentPO dept = departmentDao.get(approvalDecorationBelongItemPO.getBdid());
			DepartmentPO regn = departmentDao.get(approvalDecorationBelongItemPO.getBrid());

			if (userPO == null) {
				throw new FLException(190005, "人员不存在");
			}

			DecorationBelongPO decorationBelongPO = new DecorationBelongPO();

			decorationBelongPO.setDepartment(dept);
			decorationBelongPO.setRegion(regn);

			if (dept.getBusitype() != null) decorationBelongPO.setBusitype(dept.getBusitype());

			if (DecorationBelongPO.BELONGTYPE_DESIGN_INT == belongType) {
				decorationAdditionPO.setDesign(userPO.getCurrentName(), dept.getName(), regn.getName());
			} else if (DecorationBelongPO.BELONGTYPE_SALESMAN_INT == belongType) {
				decorationAdditionPO.setSales(userPO.getCurrentName(), dept.getName(), regn.getName());
			}

			if (mergeFlag != 1 && DecorationBelongPO.DEFAULTFLAG_TRUE_INT == approvalDecorationBelongItemPO.getDefaultFlag()) {
				if (DecorationBelongPO.BELONGTYPE_DESIGN_INT == belongType) {
					decorationPO.setDesigner(userPO);
					decorationPO.setDesignDept(userPO.getDept());
				} else if (DecorationBelongPO.BELONGTYPE_SALESMAN_INT == belongType) {
					decorationPO.setSalesman(userPO);
					decorationPO.setSalesDept(userPO.getDept());
				}
			}

			decorationBelongPO.setOrderId(decorationPO.getOrderId());
			decorationBelongPO.setBelonger(userPO);
			decorationBelongPO.setRate(mergeFlag == 1 ? 500 : approvalDecorationBelongItemPO.getRate());
			decorationBelongPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			decorationBelongPO.setOperater(approvalPO.getReceiver());
			decorationBelongPO.setDefaultFlag(approvalDecorationBelongItemPO.getDefaultFlag());
			decorationBelongPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

			decorationBelongPO.setCcid(approvalDecorationBelongPO.getCcid());

			decorationBelongPO.setType(belongType);
			decorationBelongPO.setStatus(DecorationBelongPO.STATUS_INVALID_INT);

			decorationBelongDao.save(decorationBelongPO);
		}

		decorationAdditionPO.setBelongTime(DateUtil.getDateToTimestamp(new Date()));

		decorationAdditionDao.update(decorationAdditionPO);
		decorationDao.update(decorationPO);

		// 生成消息队列数据：invalidCcid=失效人员ccid, approvalDecorationBelongPO.getCcid()=生效人员ccid
		String approveBelongArgs = buildApproveBelongEventArgs(orderId, approvalPO.getReceiver().getUserId(), belongType, decorationPO, invalidCcid, approvalDecorationBelongPO.getCcid(), mergeFlag);
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "approveForDecorationBelong", approveBelongArgs));
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "approveForDecorationBelong", approveBelongArgs.replace("\"event\":\"" + (belongType == DecorationBelongPO.BELONGTYPE_DESIGN_INT ? "TEAM_DESIGNER_CHANGED" : "TEAM_SALESMAN_CHANGED") + "\"", "\"event\":\"TEAM_SALESMAN_CHANGED\"")));
		// 生成消息提示数据
		messageQueuingDao.save(new MessageCueuingPO().init(orderId, "approveForDecorationBelong", approveBelongArgs));

		// 完成关联的客户机会
		CustomerChancePO customerChancePO = customerChanceDao.queryCustomerChance(orderId);
		if (customerChancePO != null && customerChancePO.getStatus() == CustomerChancePO.STATUS_CONFIRM_INT) {
			customerChancePO.setStatus(CustomerChancePO.STATUS_COMPLETE_INT);
			customerChanceDao.update(customerChancePO);
			customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerChancePO.getSource().getCsid(), customerChancePO.getCcid(), String.format("客户机会完成(归属审批通过),装修单号:%s,归属:%s(%s),部门:%s(%s),分区:%s(%s)", orderId, customerChancePO.getBelonger().getCurrentName(), customerChancePO.getBelonger().getUserId(), customerChancePO.getDepartment().getName(), customerChancePO.getDepartment().getNo(), customerChancePO.getRegion().getName(), customerChancePO.getRegion().getNo()), CustomerSourceRecordPO.TYPE_SPECIAL_INT, approvalPO.getReceiver()));
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmForDecorationBelong(ApprovalPO approvalPO) throws FLException {

		ApprovalDecorationBelongPO approvalDecorationBelongPO = approvalDecorationBelongDao.queryApprovalDecorationBelongByAId(approvalPO.getAid());

		if (approvalDecorationBelongPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		decorationService.sendMessage(approvalDecorationBelongPO.getOrderId(), "装修归属确认", String.format("装修单:%s归属确认", approvalDecorationBelongPO.getOrderId()), "/page/approval/approval");

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int tranApprovalForDecorationBelong(String orderId, Short type, String userId, int company, String code, String forms) throws FLException {
		return tranApprovalForDecorationBelong(orderId, type, userId, company, code, forms, (short) 0);
	}

	@Transactional(rollbackFor = Exception.class)
	public int tranApprovalForDecorationBelong(String orderId, Short type, String userId, int company, String code, String forms, short mergeFlag) throws FLException {

		UserPO designer = userDao.queryUserByUserId(userId);

		ApprovalVO approvalVO = new ApprovalVO();

		approvalVO.setReceiver(new UserBaseVO(designer.getUserId()));

		ApprovalDecorationBelongVO approvalDecorationBelongVO = new ApprovalDecorationBelongVO();

		approvalDecorationBelongVO.setOrderId(orderId);
		approvalDecorationBelongVO.setBelongType(type);
		approvalDecorationBelongVO.setMergeFlag(mergeFlag);

		List<ApprovalDecorationBelongItemVO> approvalDecorationBelongItemVOs = new ArrayList<ApprovalDecorationBelongItemVO>();

		ApprovalDecorationBelongItemVO approvalDecorationBelongItemVO = new ApprovalDecorationBelongItemVO();

		approvalDecorationBelongItemVO.setOrderId(orderId);
		approvalDecorationBelongItemVO.setBdid(designer.getDept().getDid());
		approvalDecorationBelongItemVO.setBrid(designer.getDept().getFatherDept().getDid());
		approvalDecorationBelongItemVO.setRate(1000);
		approvalDecorationBelongItemVO.setDefaultFlag(DecorationBelongPO.DEFAULTFLAG_TRUE_INT);

		approvalDecorationBelongItemVOs.add(approvalDecorationBelongItemVO);

		submitApprovalForDecorationBelong(approvalVO, approvalDecorationBelongVO, approvalDecorationBelongItemVOs, designer.getUserId(), company, code, forms);

		return 0;
	}

	private String buildApproveBelongEventArgs(String orderId, String userId, short belongType, DecorationPO decorationPO, Long invalidCcid, Long activeCcid, short mergeFlag) {

		String originOrderId = "";
		String targetOrderId = "";

		if (invalidCcid != null && invalidCcid > 0) {
			CustomerChanceOrderPO chanceOrder = customerChanceOrderDao.queryCustomerChanceOrder(invalidCcid);
			if (chanceOrder != null) originOrderId = chanceOrder.getOrderId();
		}

		if (activeCcid != null && activeCcid > 0) {
			CustomerChanceOrderPO chanceOrder = customerChanceOrderDao.queryCustomerChanceOrder(activeCcid);
			if (chanceOrder != null) targetOrderId = chanceOrder.getOrderId();
		}

		return "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"belongType\":" + belongType + ",\"event\":\"" + (belongType == DecorationBelongPO.BELONGTYPE_DESIGN_INT ? "TEAM_DESIGNER_CHANGED" : "TEAM_SALESMAN_CHANGED") + "\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + ",\"originOrderId\":\"" + originOrderId + "\",\"targetOrderId\":\"" + targetOrderId + "\",\"mergeFlag\":" + mergeFlag + (activeCcid != null && activeCcid > 0 ? ",\"ccid\":" + activeCcid : "") + "}";
	}
}
