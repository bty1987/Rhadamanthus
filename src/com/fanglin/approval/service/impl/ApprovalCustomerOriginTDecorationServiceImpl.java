/**
 * @File Name		: ApprovalCustomerOriginTDecorationServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2018-12-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalCustomerOriginTDecorationDao;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalCustomerOriginTDecorationPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalCustomerOriginTDecorationService;
import com.fanglin.approval.vo.ApprovalCustomerOriginTDecorationVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerOriginDao;
import com.fanglin.customer.po.CustomerOriginPO;
import com.fanglin.customer.vo.CustomerOriginVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.decoration.service.impl.DecorationServiceImpl;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("approvalCustomerOriginTDecorationService")
@Transactional(readOnly = true)
public class ApprovalCustomerOriginTDecorationServiceImpl implements ApprovalCustomerOriginTDecorationService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalCustomerOriginTDecorationDao approvalCustomerOriginTDecorationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CustomerOriginDao customerOriginDao;

	@Autowired
	private DecorationServiceImpl decorationService;

	@Autowired
	private MessageService messageService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pageApprovalCustomerOriginTDecoration(Paging paging, List<Filter> filters, int company) throws FLException {

		List<ApprovalCustomerOriginTDecorationPO> approvalCustomerOriginTDecorationPOs = approvalCustomerOriginTDecorationDao.pageApprovalCustomerOriginTDecorationPO(paging, filters, company);
		List<ApprovalCustomerOriginTDecorationVO> approvalCustomerOriginTDecorationVOs = new ArrayList<ApprovalCustomerOriginTDecorationVO>();

		for (ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO : approvalCustomerOriginTDecorationPOs) {

			ApprovalCustomerOriginTDecorationVO approvalCustomerOriginTDecorationVO = new ApprovalCustomerOriginTDecorationVO();

			approvalCustomerOriginTDecorationVO.setApproval(new ApprovalVO(new UserBaseVO(), new UserBaseVO()));
			approvalCustomerOriginTDecorationVO.setCustomerOrigin(new CustomerOriginVO(new VillageVO(new CityProperVO()), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new CustomerVO(), new HouseVO(new VillageVO(new CityProperVO(new CityVO()))), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new DecorationBusitypeVO()));
			approvalCustomerOriginTDecorationVO.setDecorationBusitype(new DecorationBusitypeVO());
			approvalCustomerOriginTDecorationVO.setSalesman(new UserBaseVO());

			BeanUtil.copyProperties(approvalCustomerOriginTDecorationPO, approvalCustomerOriginTDecorationVO, Arrays.asList("approval", "customerOrigin", "decorationBusitype", "salesman"));

			approvalCustomerOriginTDecorationPO.ptv(approvalCustomerOriginTDecorationVO);

			approvalCustomerOriginTDecorationVOs.add(approvalCustomerOriginTDecorationVO);
		}

		paging.setData(approvalCustomerOriginTDecorationVOs);
	}

	@Override
	public ApprovalCustomerOriginTDecorationVO queryApprovalCustomerOriginTDecoration(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO = approvalCustomerOriginTDecorationDao.queryCustomerOriginTDecorationByAid(approvalPO.getAid());

		if (approvalCustomerOriginTDecorationPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerOriginVO customerOriginVO = new CustomerOriginVO(new VillageVO(new CityProperVO()), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new CustomerVO(), new HouseVO(new VillageVO(new CityProperVO(new CityVO()))), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new DecorationBusitypeVO());
		CustomerOriginPO customerOriginPO = approvalCustomerOriginTDecorationPO.getCustomerOrigin();

		BeanUtil.copyProperties(customerOriginPO, customerOriginVO, Arrays.asList("village", "creater", "belonger", "department", "region", "customer", "house", "designer", "salesman", "decorationBusitype"));

		BeanUtil.copyProperties(customerOriginPO.getCustomer(), customerOriginVO.getCustomer());
		BeanUtil.copyProperties(customerOriginPO.getDesigner(), customerOriginVO.getDesigner(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(customerOriginPO.getSalesman(), customerOriginVO.getSalesman(), Arrays.asList("dept", "duty"));

		if (customerOriginPO.getHouse() != null) customerOriginPO.getHouse().ptv(customerOriginVO.getHouse());

		if (customerOriginPO.getDesigner() != null) {
			BeanUtil.copyProperties(customerOriginPO.getDesigner().getDept(), customerOriginVO.getDesigner().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(customerOriginPO.getDesigner().getDept().getFatherDept(), customerOriginVO.getDesigner().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));
		}
		if (customerOriginPO.getSalesman() != null) {
			BeanUtil.copyProperties(customerOriginPO.getSalesman().getDept(), customerOriginVO.getSalesman().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(customerOriginPO.getSalesman().getDept().getFatherDept(), customerOriginVO.getSalesman().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));
		}

		UserBaseVO salesman = new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO()));
		ApprovalCustomerOriginTDecorationVO approvalCustomerOriginTDecorationVO = new ApprovalCustomerOriginTDecorationVO(customerOriginVO, new DecorationBusitypeVO(), salesman);

		BeanUtil.copyProperties(approvalCustomerOriginTDecorationPO.getSalesman(), approvalCustomerOriginTDecorationVO.getSalesman(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(approvalCustomerOriginTDecorationPO.getDecorationBusitype(), approvalCustomerOriginTDecorationVO.getDecorationBusitype());

		if (customerOriginPO.getDesigner() != null) {
			BeanUtil.copyProperties(approvalCustomerOriginTDecorationPO.getSalesman().getDept(), approvalCustomerOriginTDecorationVO.getSalesman().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(approvalCustomerOriginTDecorationPO.getSalesman().getDept().getFatherDept(), approvalCustomerOriginTDecorationVO.getSalesman().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));
		}

		BeanUtil.copyPropertie(approvalCustomerOriginTDecorationPO, approvalCustomerOriginTDecorationVO, Arrays.asList("approval", "customerOrigin", "decorationBusitype", "salesman"));

		return approvalCustomerOriginTDecorationVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForCustomerOriginTDecoration(ApprovalVO approvalVO, ApprovalCustomerOriginTDecorationVO approvalCustomerOriginTDecorationVO, String userId, int company) throws FLException {

		Long csid = approvalCustomerOriginTDecorationVO.getCustomerOrigin().getCsid();
		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT, String.valueOf(csid));

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		CustomerOriginPO customerOriginPO = customerOriginDao.get(csid);

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (!Arrays.asList(CustomerOriginPO.STATUS_CONFIRM_INT, CustomerOriginPO.STATUS_REFUSE_INT).contains(customerOriginPO.getStatus())) {
			throw new FLException(330014, "客源状态不可操作");
		}

		decorationService.checkOverDecoration(customerOriginPO.getCustomer().getCid(), customerOriginPO.getHouse().getHid(), company);

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		HousePO housePO = customerOriginPO.getHouse();
		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客源转装修单,客户名:%s,楼盘:%s %s %s %s", customerOriginPO.getName(), villagePO.getCityProper().getCity().getName(), villagePO.getCityProper().getName(), villagePO.getName(), housePO.getHouseNumber());

		approvalPO = new ApprovalPO().init(sender, receiver, "", String.valueOf(csid), ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		UserPO salesman = userDao.queryUserByUserId(approvalCustomerOriginTDecorationVO.getSalesman().getUserId());

		long dbid = approvalCustomerOriginTDecorationVO.getDecorationBusitype().getDbid();

		ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO = new ApprovalCustomerOriginTDecorationPO(new CustomerOriginPO(csid), new DecorationBusitypePO(dbid), salesman);

		BeanUtil.copyPropertie(approvalCustomerOriginTDecorationVO, approvalCustomerOriginTDecorationPO, Arrays.asList("customerOrigin", "decorationBusitype", "salesman"));

		approvalCustomerOriginTDecorationPO.setApproval(approvalPO);

		approvalCustomerOriginTDecorationDao.save(approvalCustomerOriginTDecorationPO);

		customerOriginPO.setStatus(CustomerOriginPO.STATUS_APPROVE_INT);

		customerOriginPO.setSalesman(salesman);

		customerOriginDao.update(customerOriginPO);

		String contents = String.format("客源转装修单提交,客户名:%s,楼盘:%s %s,装修单号:%s,批注:%s", customerOriginPO.getName(), villagePO.getName(), housePO.getHouseNumber(), customerOriginPO.getOrderId(), approvalPO.getAnnotate());

		messageService.sendMessage(receiver.getUserId(), null, contents, MessagePO.TYPE_SEND_APPROVAL_INT, receiver.getCompany());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForCustomerOriginTDecoration(ApprovalPO approvalPO) throws FLException {

		ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO = approvalCustomerOriginTDecorationDao.queryCustomerOriginTDecorationByAid(approvalPO.getAid());

		if (approvalCustomerOriginTDecorationPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerOriginPO customerOriginPO = approvalCustomerOriginTDecorationPO.getCustomerOrigin();

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		DecorationVO decorationVO = new DecorationVO();

		BeanUtil.copyPropertie(approvalCustomerOriginTDecorationPO, decorationVO, Arrays.asList("customerOrigin", "decorationBusitype", "salesman"));

		decorationVO.setCreater(new UserBaseVO(customerOriginPO.getCreater().getUserId()));
		decorationVO.setHouse(new HouseVO(customerOriginPO.getHouse().getHid()));
		decorationVO.setCustomer(new CustomerVO(customerOriginPO.getCustomer().getCid()));
		decorationVO.setDesigner(new UserBaseVO(customerOriginPO.getDesigner().getUserId()));
		decorationVO.setSalesman(new UserBaseVO(approvalCustomerOriginTDecorationPO.getSalesman().getUserId()));
		decorationVO.setGrade("C");
		decorationVO.setNotSalesmanRate(0);
		decorationVO.setBusitype(approvalCustomerOriginTDecorationPO.getDecorationBusitype().getDbid());

		decorationService.tranDecoration(decorationVO, approvalPO.getSender().getCompany());

		customerOriginPO.setOrderId(decorationVO.getOrderId());
		customerOriginPO.setStatus(CustomerOriginPO.STATUS_BIND_INT);

		customerOriginDao.update(customerOriginPO);

		HousePO housePO = customerOriginPO.getHouse();
		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客源转装修单成功,客户名:%s,楼盘:%s %s,装修单号:%s,批注:%s", customerOriginPO.getName(), villagePO.getName(), housePO.getHouseNumber(), customerOriginPO.getOrderId(), approvalPO.getAnnotate());

		UserPO designer = customerOriginPO.getDesigner();
		UserPO salesman = customerOriginPO.getSalesman();

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, designer.getCompany());
		messageService.sendMessage(salesman.getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, salesman.getCompany());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuseForCustomerOriginTDecoration(ApprovalPO approvalPO) throws FLException {

		ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO = approvalCustomerOriginTDecorationDao.queryCustomerOriginTDecorationByAid(approvalPO.getAid());

		if (approvalCustomerOriginTDecorationPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerOriginPO customerOriginPO = approvalCustomerOriginTDecorationPO.getCustomerOrigin();

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		customerOriginPO.setStatus(CustomerOriginPO.STATUS_REFUSE_INT);

		customerOriginDao.update(customerOriginPO);

		HousePO housePO = customerOriginPO.getHouse();
		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客源转装修单失败,审批拒绝,客户名:%s,楼盘:%s %s,批注:%s", customerOriginPO.getName(), villagePO.getName(), housePO.getHouseNumber(), approvalPO.getAnnotate());

		UserPO designer = customerOriginPO.getDesigner();
		UserPO salesman = customerOriginPO.getSalesman();

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, designer.getCompany());
		messageService.sendMessage(salesman.getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, salesman.getCompany());

		return 0;
	}

}
