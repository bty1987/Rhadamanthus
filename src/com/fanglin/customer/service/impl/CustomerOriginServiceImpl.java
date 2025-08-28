package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.dao.VillageDao;
import com.fanglin.communion.po.CustomerPO;
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
import com.fanglin.customer.dao.CustomerOriginRecordDao;
import com.fanglin.customer.po.CustomerOriginPO;
import com.fanglin.customer.po.CustomerOriginRecordPO;
import com.fanglin.customer.service.CustomerOriginService;
import com.fanglin.customer.vo.CustomerOriginVO;
import com.fanglin.data.common.dao.DecorationBusitypeDao;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.decoration.service.impl.DecorationServiceImpl;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.right.dao.CustomerSourceRightDao;
import com.fanglin.right.po.CustomerSourceRightPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("customerOriginService")
@Transactional(readOnly = true)
public class CustomerOriginServiceImpl implements CustomerOriginService {

	@Autowired
	private CustomerOriginDao customerOriginDao;

	@Autowired
	private CustomerSourceRightDao customerSourceRightDao;

	@Autowired
	private DecorationBusitypeDao decorationBusitypeDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CustomerOriginRecordDao customerOrginRecordDao;

	@Autowired
	private VillageDao villageDao;

	@Autowired
	private HouseDao houseDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private DecorationServiceImpl decorationService;

	@Override
	public void pageCustomerOrigin(Paging paging, List<Filter> filters, String userId, String user) {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (user.equals("share")) {
			filters.add(new Filter("belonger.uid", "", "eq"));
		} else {
			filters.add(new Filter(user, String.valueOf(userPO.getUid()), "eq"));
		}

		List<CustomerOriginPO> customerOriginPOs = customerOriginDao.pageCustomerOrigin(paging, filters, null);
		List<CustomerOriginVO> customerOriginVOs = new ArrayList<CustomerOriginVO>();

		for (CustomerOriginPO customerOriginPO : customerOriginPOs) {
			customerOriginVOs.add(customerOriginPO.ptv(new CustomerOriginVO(new VillageVO(new CityProperVO()), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new DecorationBusitypeVO())));
		}

		paging.setData(customerOriginVOs);
	}

	@Override
	public void pageCustomerOriginForAdvance(Paging paging, List<Filter> filters, String userId) {

		UserPO userPO = userDao.queryUserByUserId(userId);

		List<CustomerSourceRightPO> customerSourceRightPOs = customerSourceRightDao.queryCustomerSourceRightByUserId(userPO.getUid(), userPO.getCompany());

		List<Integer> dids = new ArrayList<Integer>();

		for (CustomerSourceRightPO customerSourceRightPO : customerSourceRightPOs) {
			dids.add(customerSourceRightPO.getDid());
		}

		if (dids.size() == 1 && dids.get(0) == CustomerSourceRightPO.DEPARTMENT_ALL_ENABLE_INT) {
			dids = null;
		} else if (dids.size() == 0) {
			return;
		}

		List<CustomerOriginPO> customerOriginPOs = customerOriginDao.pageCustomerOrigin(paging, filters, dids);
		List<CustomerOriginVO> customerOriginVOs = new ArrayList<CustomerOriginVO>();

		for (CustomerOriginPO customerOriginPO : customerOriginPOs) {
			customerOriginVOs.add(customerOriginPO.ptv(new CustomerOriginVO(new VillageVO(new CityProperVO()), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new DecorationBusitypeVO())));
		}

		paging.setData(customerOriginVOs);
	}

	@Override
	public CustomerOriginVO queryCustomerOriginByCsid(CustomerOriginVO customerOriginVO) throws FLException {

		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		customerOriginVO = customerOriginPO.ptv(new CustomerOriginVO(new VillageVO(new CityProperVO()), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new DecorationBusitypeVO()));

		customerOriginVO.setPhone(FormatUtil.decodePhone(customerOriginPO.getCustomer().getPhone()));

		return customerOriginVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException {

		if (customerOriginVO.getDecorationBusitype() == null || customerOriginVO.getDecorationBusitype().getDbid() == null) {
			throw new FLException(130061, "业务类型不存在");
		}

		DecorationBusitypePO busitype = decorationBusitypeDao.get(customerOriginVO.getDecorationBusitype().getDbid());

		if (busitype == null) {
			throw new FLException(130061, "业务类型不存在");
		}

		if (busitype.getType() == DecorationBusitypePO.TYPE_SOURCE_INT) {
			throw new FLException(130062, "业务类型不匹配");
		}

		CustomerOriginPO customerOriginPO = new CustomerOriginPO();

		BeanUtil.copyProperties(customerOriginVO, customerOriginPO, Arrays.asList("village", "creater", "belonger", "department", "region", "customer", "house", "designer", "salesman", "decorationBusitype"));

		customerOriginPO.setPhone(FormatUtil.encodePhone(customerOriginVO.getPhone()));

		UserPO userPO = userDao.queryUserByUserId(userId);

		customerOriginPO.setCreater(userPO);
		customerOriginPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		customerOriginPO.setStatus((short) 0);

		customerOriginPO.setBelonger(userPO);
		customerOriginPO.setDepartment(userPO.getDept());
		customerOriginPO.setRegion(userPO.getDept().getFatherDept());

		if (customerOriginVO.getDesigner() != null && customerOriginVO.getDesigner().getUserId() != null) {
			customerOriginPO.setDesigner(userDao.queryUserByUserId(customerOriginVO.getDesigner().getUserId()));
		}

		if (customerOriginVO.getSalesman() != null && customerOriginVO.getSalesman().getUserId() != null) {
			customerOriginPO.setSalesman(userDao.queryUserByUserId(customerOriginVO.getSalesman().getUserId()));
		}

		VillagePO villagePO = villageDao.get(customerOriginVO.getVillage().getNo());

		customerOriginPO.setVillage(villagePO);
		customerOriginPO.setDecorationBusitype(new DecorationBusitypePO(customerOriginVO.getDecorationBusitype().getDbid()));

		customerOriginDao.save(customerOriginPO);

		customerOrginRecordDao.save(new CustomerOriginRecordPO().init(customerOriginPO.getCsid(), String.format("原楼盘:%s,原楼牌号:%s原电话:%s,原目的:%s,原风格意向:%s,原价格:%s,原等级:%s", customerOriginPO.getVillage().getName(), customerOriginPO.getHouseNumber(), FormatUtil.encodePhone(customerOriginPO.getPhone()), customerOriginPO.getPurpose(), customerOriginPO.getIntention(), customerOriginPO.getPrice(), customerOriginPO.getGrade()), CustomerOriginRecordPO.TYPE_DEFINE_INT, userDao.queryUserByUserId(userId)));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException {

		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (customerOriginPO.getStatus() != CustomerOriginPO.STATUS_INIT_INT) {
			throw new FLException(330014, "客源状态不可操作");
		}

		if (customerOriginVO.getVillage() != null && customerOriginVO.getVillage().getNo() != null) {
			VillagePO villagePO = villageDao.get(customerOriginVO.getVillage().getNo());

			String oldVillageName = "";

			if (customerOriginPO.getVillage() != null) {
				oldVillageName = customerOriginPO.getVillage().getName();
			}

			customerOrginRecordDao.save(new CustomerOriginRecordPO().init(customerOriginPO.getCsid(), String.format("原楼盘:%s,原楼牌号:%s,原电话:%s,原目的:%s,原风格意向:%s,原价格:%s,原等级:%s,新楼盘:%s,新楼牌号:%s,新电话:%s,新目的:%s,新风格意向:%s,新价格:%s,新等级:%s", oldVillageName, customerOriginPO.getHouseNumber(), FormatUtil.encodePhone(customerOriginPO.getPhone()), customerOriginPO.getPurpose(), customerOriginPO.getIntention(), customerOriginPO.getPrice(), customerOriginPO.getGrade(), villagePO.getName(), customerOriginVO.getHouseNumber(), FormatUtil.encodePhone(customerOriginVO.getPhone()), customerOriginVO.getPurpose(), customerOriginVO.getIntention(), customerOriginVO.getPrice(), customerOriginVO.getGrade()), CustomerOriginRecordPO.TYPE_UPDATE_INT, userDao.queryUserByUserId(userId)));
			customerOriginPO.setVillage(villagePO);
		}

		BeanUtil.copyPropertie(customerOriginVO, customerOriginPO, Arrays.asList("village", "creater", "belonger", "department", "region", "customer", "house", "designer", "salesman", "decorationBusitype", "phone"));

		customerOriginDao.update(customerOriginPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerOriginForBelonger(CustomerOriginVO customerOriginVO, String userId) throws FLException {

		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		UserPO belonger = userDao.queryUserByUserId(customerOriginVO.getBelonger().getUserId());

		String oldBelongName = "";
		String oldBelongDept = "";
		String oldBelongFatherDept = "";

		if (customerOriginPO.getBelonger() != null) {
			oldBelongName = customerOriginPO.getBelonger().getUserName();
			oldBelongDept = customerOriginPO.getBelonger().getDept().getName();
			oldBelongFatherDept = customerOriginPO.getBelonger().getDept().getFatherDept().getName();
		}

		customerOrginRecordDao.save(new CustomerOriginRecordPO().init(customerOriginPO.getCsid(), String.format("原归属人:%s,原归属部门:%s,原归属分区:%s,新归属人:%s,新归属部门:%s,新归属分区:%s", oldBelongName, oldBelongDept, oldBelongFatherDept, belonger.getUserName(), belonger.getDept().getName(), belonger.getDept().getFatherDept().getName()), CustomerOriginRecordPO.TYPE_DEFINE_INT, userDao.queryUserByUserId(userId)));

		customerOriginPO.setBelonger(belonger);
		customerOriginPO.setDepartment(belonger.getDept());
		customerOriginPO.setRegion(belonger.getDept().getFatherDept());

		customerOriginDao.update(customerOriginPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void freeCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException {

		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (customerOriginPO.getBelonger() == null) {
			throw new FLException(330002, "客源归属人错误");
		}

		if (customerOriginPO.getStatus() != CustomerOriginPO.STATUS_INIT_INT) {
			throw new FLException(330014, "客源状态不可操作");
		}

		if (!userId.equals(customerOriginPO.getBelonger().getUserId())) {
			throw new FLException(330002, "客源归属人错误");
		}

		customerOrginRecordDao.save(new CustomerOriginRecordPO().init(customerOriginPO.getCsid(), String.format("原归属人姓名:%s,原归属人员工号:%s,原归属人电话:%s", customerOriginPO.getBelonger().getUserName(), userId, userDao.queryUserByUserId(userId).getPhone()), CustomerOriginRecordPO.TYPE_DEFINE_INT, userDao.queryUserByUserId(userId)));

		customerOriginPO.setBelonger(null);

		customerOriginDao.update(customerOriginPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void takeCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException {

		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (customerOriginPO.getStatus() != CustomerOriginPO.STATUS_INIT_INT) {
			throw new FLException(330014, "客源状态不可操作");
		}

		if (userDao.queryUserByUserId(userId) == null) {
			throw new FLException(330002, "客源归属人错误");
		}

		UserPO belonger = userDao.queryUserByUserId(userId);

		customerOriginPO.setBelonger(belonger);
		customerOriginPO.setDepartment(belonger.getDept());
		customerOriginPO.setRegion(belonger.getDept().getFatherDept());

		customerOriginDao.update(customerOriginPO);

		customerOrginRecordDao.save(new CustomerOriginRecordPO().init(customerOriginPO.getCsid(), String.format("认领人姓名:%s,认领人员工号:%s,认领人电话:%s", userDao.queryUserByUserId(userId).getUserName(), userId, userDao.queryUserByUserId(userId).getPhone()), CustomerOriginRecordPO.TYPE_DEFINE_INT, userDao.queryUserByUserId(userId)));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void bindCustomerOrigin(CustomerOriginVO customerOriginVO, String userId, int company) throws FLException {

		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (customerOriginPO.getStatus() != CustomerOriginPO.STATUS_INIT_INT) {
			throw new FLException(330014, "客源状态不可操作");
		}

		CustomerPO customerPO = customerDao.get(customerOriginVO.getCustomer().getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户不存在");
		}

		customerOriginPO.setCustomer(customerPO);
		customerOriginPO.setPhone(customerPO.getPhone());

		HousePO housePO = houseDao.get(customerOriginVO.getHouse().getHid());

		if (housePO == null) {
			throw new FLException(130017, "房产不存在");
		}

		decorationService.checkOverDecoration(customerPO.getCid(), housePO.getHid(), company);

		customerOriginPO.setHouse(housePO);
		customerOriginPO.setVillage(housePO.getVillage());
		customerOriginPO.setHouseNumber(housePO.getHouseNumber());

		UserPO designer = userDao.queryUserByUserId(customerOriginVO.getDesigner().getUserId());
		UserPO salesman = userDao.queryUserByUserId(customerOriginVO.getSalesman().getUserId());

		customerOriginPO.setDesigner(designer);
		customerOriginPO.setSalesman(salesman);

		customerOriginPO.setDecorationBusitype(new DecorationBusitypePO(customerOriginVO.getDecorationBusitype().getDbid()));

		customerOriginDao.update(customerOriginPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void commitCustomerOrigin(CustomerOriginVO customerOrigin) throws FLException {

		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOrigin.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (customerOriginPO.getStatus() != CustomerOriginPO.STATUS_INIT_INT) {
			throw new FLException(330014, "客源状态不可操作");
		}

		if (customerOriginPO.getCustomer() == null) {
			throw new FLException(330015, "客源未绑定");
		}

		customerOriginPO.setStatus(CustomerOriginPO.STATUS_COMMIT_INT);

		customerOriginDao.update(customerOriginPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmCustomerOrigin(CustomerOriginVO customerOriginVO, String securityCode, String verifyCode) throws FLException {

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330012, "验证失败,请重新验证");
		}

		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (customerOriginPO.getStatus() != CustomerOriginPO.STATUS_COMMIT_INT) {
			throw new FLException(330014, "客源状态不可操作");
		}

		if (customerOriginVO.getPhone() != null && !customerOriginVO.getPhone().equals(customerOriginPO.getPhone())) {
			throw new FLException(130115, "客户电话不匹配");
		}

		customerOriginPO.setStatus(CustomerOriginPO.STATUS_CONFIRM_INT);

		customerOriginDao.update(customerOriginPO);

		String content = String.format("客源确认,客户名:%s,楼盘:%s.", customerOriginPO.getName(), customerOriginPO.getHouse().getVillage().getName());

		UserPO designer = customerOriginPO.getDesigner();

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_CUSTOMER_INT, designer.getCompany());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void cancelCustomerOrigin(CustomerOriginVO customerOrigin) throws FLException {

		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOrigin.getCsid());

		List<Short> status = Arrays.asList(CustomerOriginPO.STATUS_COMMIT_INT, CustomerOriginPO.STATUS_CONFIRM_INT, CustomerOriginPO.STATUS_REFUSE_INT);

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (!status.contains(customerOriginPO.getStatus())) {
			throw new FLException(330014, "客源状态不可操作");
		}

		customerOriginPO.setStatus(CustomerOriginPO.STATUS_INIT_INT);

		customerOriginDao.update(customerOriginPO);
	}

}
