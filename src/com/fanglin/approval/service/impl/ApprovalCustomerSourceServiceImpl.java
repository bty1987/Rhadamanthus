/**
 * @File Name		: ApprovalCustomerSourceServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2019-10-12
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalCustomerSourceDao;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalCustomerSourcePO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalCustomerSourceService;
import com.fanglin.approval.vo.ApprovalCustomerSourceVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.data.common.dao.DecorationBusitypeDao;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.decoration.service.impl.DecorationServiceImpl;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;

@Service("approvalCustomerSourceService")
@Transactional(readOnly = true)
public class ApprovalCustomerSourceServiceImpl implements ApprovalCustomerSourceService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalCustomerSourceDao approvalCustomerSourceDao;

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private CustomerSourceDao customerSourceDao;

	@Autowired
	private HouseDao houseDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationBusitypeDao decorationBusitypeDao;

	@Autowired
	private DecorationServiceImpl decorationService;

	@Autowired
	private MessageService messageService;

	@Override
	public ApprovalCustomerSourceVO queryApprovalCustomerSource(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		ApprovalCustomerSourcePO approvalCustomerSourcePO = approvalCustomerSourceDao.queryCustomerSourceByAid(approvalPO.getAid());

		if (approvalCustomerSourcePO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerSourcePO customerSourcePO = customerSourceDao.get(approvalCustomerSourcePO.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330001, "客源不存在");
		}

		CustomerSourceVO customerSourceVO = new CustomerSourceVO(new VillageVO(new CityProperVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new CustomerVO(), new HouseVO(), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())));

		customerSourcePO.ptv(customerSourceVO);

		ApprovalCustomerSourceVO approvalCustomerSourceVO = new ApprovalCustomerSourceVO();

		approvalCustomerSourceVO.setSource(customerSourceVO);

		return approvalCustomerSourceVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForCustomerSource(ApprovalVO approvalVO, ApprovalCustomerSourceVO approvalCustomerSourceVO, String userId, int company) throws FLException {

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		Long csid = approvalCustomerSourceVO.getCsid();

		CustomerSourcePO customerSourcePO = customerSourceDao.get(csid);

		if (customerSourcePO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (customerSourcePO.getStatus() != CustomerSourcePO.STATUS_INIT_INT) {
			throw new FLException(330074, "客户资源不可操作");
		}

		if (customerSourcePO.getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_CUSTOMER_SOURCE_INT, String.valueOf(csid));

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		HousePO housePO = houseDao.get(approvalCustomerSourceVO.getHid());

		if (housePO == null) {
			throw new FLException(130017, "房产不存在");
		}

		DecorationBusitypePO busitype = decorationBusitypeDao.get(approvalCustomerSourceVO.getDbid());

		if (busitype == null) {
			throw new FLException(130061, "业务类型不存在");
		}

		decorationService.checkOverDecoration(customerSourcePO.getCustomer().getCid(), housePO.getHid(), company);

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客源初审,客户名:%s,楼盘:%s %s %s %s", customerSourcePO.getName(), villagePO.getCityProper().getCity().getName(), villagePO.getCityProper().getName(), villagePO.getName(), housePO.getHouseNumber());

		approvalPO = new ApprovalPO().init(sender, receiver, "", String.valueOf(csid), ApprovalPO.APPROVAL_TYPE_CUSTOMER_SOURCE_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalCustomerSourcePO approvalCustomerSourcePO = new ApprovalCustomerSourcePO();

		BeanUtil.copyPropertie(approvalCustomerSourceVO, approvalCustomerSourcePO);

		approvalCustomerSourcePO.setAid(approvalPO.getAid());

		approvalCustomerSourceDao.save(approvalCustomerSourcePO);

		String contents = String.format("客源初审提交,客户名:%s,楼盘:%s %s %s %s,批注:%s.", customerSourcePO.getName(), villagePO.getCityProper().getCity().getName(), villagePO.getCityProper().getName(), villagePO.getName(), housePO.getHouseNumber(), approvalPO.getAnnotate());

		messageService.sendMessage(receiver.getUserId(), null, contents, MessagePO.TYPE_SEND_APPROVAL_INT, receiver.getCompany());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForCustomerSource(ApprovalPO approvalPO) throws FLException {

		ApprovalCustomerSourcePO approvalCustomerSourcePO = approvalCustomerSourceDao.queryCustomerSourceByAid(approvalPO.getAid());

		if (approvalCustomerSourcePO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerSourcePO customerSourcePO = customerSourceDao.get(approvalCustomerSourcePO.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (CustomerSourcePO.STATUS_INIT_INT != customerSourcePO.getStatus()) {
			throw new FLException(330074, "客户资源不可操作");
		}

		HousePO housePO = houseDao.get(approvalCustomerSourcePO.getHid());

		if (housePO == null) {
			throw new FLException(130017, "房产不存在");
		}

		VillagePO villagePO = housePO.getVillage();

		customerSourcePO.setVillage(villagePO);
		customerSourcePO.setHouse(housePO);

		customerSourcePO.setStatus(CustomerSourcePO.STATUS_APPROVE_ONE_INT);

		customerSourceDao.update(customerSourcePO);

		CustomerChancePO customerChancePO = customerChanceDao.get(approvalCustomerSourcePO.getCcid());

		if (customerChancePO != null) {
			customerChancePO.setRate(approvalCustomerSourcePO.getRate());
			customerChancePO.setBusitype(new DecorationBusitypePO(approvalCustomerSourcePO.getDbid()));
		}

		String content = String.format("客源初审通过,客户名:%s,楼盘:%s %s %s %s,批注:%s.", customerSourcePO.getName(), villagePO.getCityProper().getCity().getName(), villagePO.getCityProper().getName(), villagePO.getName(), housePO.getHouseNumber(), approvalPO.getAnnotate());

		messageService.sendMessage(approvalPO.getSender().getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, approvalPO.getSender().getCompany());

		return 0;
	}

	@Override
	public int refuseForCustomerSource(ApprovalPO approvalPO) throws FLException {

		ApprovalCustomerSourcePO approvalCustomerSourcePO = approvalCustomerSourceDao.queryCustomerSourceByAid(approvalPO.getAid());

		if (approvalCustomerSourcePO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerSourcePO customerSourcePO = customerSourceDao.get(approvalCustomerSourcePO.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330001, "客源不存在");
		}

		HousePO housePO = houseDao.get(approvalCustomerSourcePO.getHid());

		if (housePO == null) {
			throw new FLException(130017, "房产不存在");
		}

		if (customerSourcePO.getStatus() == CustomerSourcePO.STATUS_APPROVE_ONE_INT) {
			customerSourcePO.setStatus(CustomerSourcePO.STATUS_INIT_INT);
			customerSourceDao.update(customerSourcePO);
		}

		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客源初审拒绝,客户名:%s,楼盘:%s %s %s %s,批注:%s.", customerSourcePO.getName(), villagePO.getCityProper().getCity().getName(), villagePO.getCityProper().getName(), villagePO.getName(), housePO.getHouseNumber(), approvalPO.getAnnotate());

		messageService.sendMessage(approvalPO.getSender().getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, approvalPO.getSender().getCompany());

		return 0;
	}

}
