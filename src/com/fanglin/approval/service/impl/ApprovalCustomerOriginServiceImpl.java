/**
 * @File Name		: ApprovalCustomerOriginServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2019-10-12
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

import com.fanglin.approval.dao.ApprovalCustomerOriginDao;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalCustomerOriginAO;
import com.fanglin.approval.po.ApprovalCustomerOriginPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalCustomerOriginService;
import com.fanglin.approval.vo.ApprovalCustomerOriginVO;
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
import com.fanglin.decoration.service.impl.DecorationServiceImpl;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("approvalCustomerOriginService")
@Transactional(readOnly = true)
public class ApprovalCustomerOriginServiceImpl implements ApprovalCustomerOriginService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalCustomerOriginDao approvalCustomerOriginDao;

	@Autowired
	private CustomerOriginDao customerOriginDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationServiceImpl decorationService;

	@Autowired
	private MessageService messageService;

	@Override
	public void pageApprovalCustomerOrigin(Paging paging, List<Filter> filters, int company) throws FLException {

		List<ApprovalCustomerOriginAO> approvalCustomerOriginAOs = approvalCustomerOriginDao.pageApprovalCustomerOrigin(paging, filters, company);
		List<ApprovalCustomerOriginVO> approvalCustomerOriginVOs = new ArrayList<ApprovalCustomerOriginVO>();

		for (ApprovalCustomerOriginAO approvalCustomerOriginAO : approvalCustomerOriginAOs) {

			ApprovalCustomerOriginVO approvalCustomerOriginVO = new ApprovalCustomerOriginVO();

			approvalCustomerOriginVO.setApproval(new ApprovalVO(new UserBaseVO(), new UserBaseVO()));
			approvalCustomerOriginVO.setCustomerOrigin(new CustomerOriginVO(new VillageVO(new CityProperVO()), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new CustomerVO(), new HouseVO(new VillageVO(new CityProperVO(new CityVO()))), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())), new DecorationBusitypeVO()));

			BeanUtil.copyProperties(approvalCustomerOriginAO, approvalCustomerOriginVO, Arrays.asList("approval", "customerOrigin"));

			approvalCustomerOriginAO.getApproval().ptv(approvalCustomerOriginVO.getApproval());
			approvalCustomerOriginAO.getCustomerOrigin().ptv(approvalCustomerOriginVO.getCustomerOrigin());

			approvalCustomerOriginVOs.add(approvalCustomerOriginVO);
		}

		paging.setData(approvalCustomerOriginVOs);
	}

	@Override
	public ApprovalCustomerOriginVO queryApprovalCustomerOrigin(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		ApprovalCustomerOriginPO approvalCustomerOriginPO = approvalCustomerOriginDao.queryCustomerOriginByAid(approvalPO.getAid());

		if (approvalCustomerOriginPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerOriginPO customerOriginPO = customerOriginDao.get(approvalCustomerOriginPO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		CustomerOriginVO customerOriginVO = new CustomerOriginVO(new VillageVO(new CityProperVO()), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new CustomerVO(), new HouseVO(new VillageVO(new CityProperVO(new CityVO()))), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())), new DecorationBusitypeVO());

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

		ApprovalCustomerOriginVO approvalCustomerOriginVO = new ApprovalCustomerOriginVO();

		approvalCustomerOriginVO.setCustomerOrigin(customerOriginVO);

		return approvalCustomerOriginVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForCustomerOrigin(ApprovalVO approvalVO, ApprovalCustomerOriginVO approvalCustomerOriginVO, String userId, int company) throws FLException {

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		Long csid = approvalCustomerOriginVO.getCsid();

		CustomerOriginPO customerOriginPO = customerOriginDao.get(csid);

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (customerOriginPO.getCustomer() == null || customerOriginPO.getHouse() == null) {
			throw new FLException(330015, "客源未绑定");
		}

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT, String.valueOf(csid));

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		decorationService.checkOverDecoration(customerOriginPO.getCustomer().getCid(), customerOriginPO.getHouse().getHid(), company);

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		UserPO belonger = customerOriginPO.getBelonger();
		UserPO designer = customerOriginPO.getDesigner();
		HousePO housePO = customerOriginPO.getHouse();
		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客源初审,客户名:%s,楼盘:%s %s %s %s", customerOriginPO.getName(), villagePO.getCityProper().getCity().getName(), villagePO.getCityProper().getName(), villagePO.getName(), housePO.getHouseNumber());

		approvalPO = new ApprovalPO().init(sender, receiver, "", String.valueOf(csid), ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalCustomerOriginPO approvalCustomerOriginPO = new ApprovalCustomerOriginPO();

		BeanUtil.copyPropertie(approvalCustomerOriginVO, approvalCustomerOriginPO);

		approvalCustomerOriginPO.setAid(approvalPO.getAid());

		approvalCustomerOriginDao.save(approvalCustomerOriginPO);

		customerOriginPO.setStatus(CustomerOriginPO.STATUS_FIRSTAPPROVAL_INT);

		customerOriginDao.update(customerOriginPO);

		String contents = String.format("客源初审提交,客户名:%s,楼盘:%s %s %s %s. 业务部:%s,业务员:%s(%s). 批注:%s.", customerOriginPO.getName(), villagePO.getCityProper().getCity().getName(), villagePO.getCityProper().getName(), villagePO.getName(), housePO.getHouseNumber(), belonger.getDept().getName(), belonger.getCurrentName(), belonger.getUserId(), approvalPO.getAnnotate());

		messageService.sendMessage(receiver.getUserId(), null, contents, MessagePO.TYPE_SEND_APPROVAL_INT, designer.getCompany());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForCustomerOrigin(ApprovalPO approvalPO) throws FLException {

		ApprovalCustomerOriginPO approvalCustomerOriginPO = approvalCustomerOriginDao.queryCustomerOriginByAid(approvalPO.getAid());

		if (approvalCustomerOriginPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerOriginPO customerOriginPO = customerOriginDao.get(approvalCustomerOriginPO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (Arrays.asList(CustomerOriginPO.STATUS_INIT_INT, CustomerOriginPO.STATUS_BIND_INT).contains(customerOriginPO.getStatus())) {
			throw new FLException(330014, "客源状态不可操作");
		}

		customerOriginPO.setStatus(CustomerOriginPO.STATUS_COMMIT_INT);

		customerOriginDao.update(customerOriginPO);

		UserPO designer = customerOriginPO.getDesigner();
		HousePO housePO = customerOriginPO.getHouse();
		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客源初审通过,客户名:%s,楼盘:%s %s %s %s,批注:%s.", customerOriginPO.getName(), villagePO.getCityProper().getCity().getName(), villagePO.getCityProper().getName(), villagePO.getName(), housePO.getHouseNumber(), approvalPO.getAnnotate());

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, designer.getCompany());

		return 0;
	}

	@Override
	public int refuseForCustomerOrigin(ApprovalPO approvalPO) throws FLException {

		ApprovalCustomerOriginPO approvalCustomerOriginPO = approvalCustomerOriginDao.queryCustomerOriginByAid(approvalPO.getAid());

		if (approvalCustomerOriginPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerOriginPO customerOriginPO = customerOriginDao.get(approvalCustomerOriginPO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		customerOriginPO.setStatus(CustomerOriginPO.STATUS_INIT_INT);

		customerOriginDao.update(customerOriginPO);

		HousePO housePO = customerOriginPO.getHouse();
		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客源初审拒绝,客户名:%s,楼盘:%s %s %s %s,批注:%s.", customerOriginPO.getName(), villagePO.getCityProper().getCity().getName(), villagePO.getCityProper().getName(), villagePO.getName(), housePO.getHouseNumber(), approvalPO.getAnnotate());

		UserPO designer = customerOriginPO.getDesigner();

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, designer.getCompany());

		return 0;
	}

}
