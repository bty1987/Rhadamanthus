package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.dao.VillageDao;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerOriginDao;
import com.fanglin.customer.dao.CustomerRecordDao;
import com.fanglin.customer.po.CustomerOriginPO;
import com.fanglin.customer.po.CustomerRecordPO;
import com.fanglin.customer.service.CustomerOriginService;
import com.fanglin.customer.vo.CustomerOriginVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.right.dao.CustomerSourceRightDao;
import com.fanglin.right.po.CustomerSourceRightPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerOriginService")
@Transactional(readOnly = true)
public class CustomerOriginServiceImpl implements CustomerOriginService {

	@Autowired
	private CustomerOriginDao customerOriginDao;

	@Autowired
	private CustomerSourceRightDao customerSourceRightDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CustomerRecordDao customerRecordDao;

	@Autowired
	private VillageDao villageDao;
	
	@Autowired
	private HouseDao houseDao;

	@Override
	public void pageCustomerOrigin(Paging paging, List<Filter> filters, String userId) {

		UserPO user = userDao.queryUserByUserId(userId);

		filters.add(new Filter("belonger", String.valueOf(user.getUid()), "eq"));

		List<CustomerOriginPO> customerOriginPOs = customerOriginDao.pageCustomerOrigin(paging, filters, null);
		List<CustomerOriginVO> customerOriginVOs = new ArrayList<CustomerOriginVO>();

		for (CustomerOriginPO customerOriginPO : customerOriginPOs) {
			customerOriginVOs.add(customerOriginPOToVO(customerOriginPO));
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
			CustomerOriginVO houseSourceVO = customerOriginPOToVO(customerOriginPO);
			customerOriginVOs.add(houseSourceVO);
		}

		paging.setData(customerOriginVOs);
	}

	@Override
	public void pageCustomerOriginForCommunion(Paging paging, List<Filter> filters) {

		Filter filter = new Filter();
		filter.setData(null);
		filter.setField("belonger.uid");
		filter.setOp("eq");
		filters.add(filter);

		List<CustomerOriginPO> customerOriginPOs = customerOriginDao.pageCustomerOrigin(paging, filters, null);
		List<CustomerOriginVO> customerOriginVOs = new ArrayList<CustomerOriginVO>();

		for (CustomerOriginPO customerOriginPO : customerOriginPOs) {
			customerOriginVOs.add(customerOriginPOToVO(customerOriginPO));
		}

		paging.setData(customerOriginVOs);
	}
	
	@Override
	public void pageCustomerOriginForDesign(Paging paging, List<Filter> filters, String userId) {
		
		UserPO user = userDao.queryUserByUserId(userId);

		filters.add(new Filter("designer", String.valueOf(user.getUid()), "eq"));

		List<CustomerOriginPO> customerOriginPOs = customerOriginDao.pageCustomerOrigin(paging, filters, null);
		List<CustomerOriginVO> customerOriginVOs = new ArrayList<CustomerOriginVO>();

		for (CustomerOriginPO customerOriginPO : customerOriginPOs) {
			customerOriginVOs.add(customerOriginPOToVO(customerOriginPO));
		}

		paging.setData(customerOriginVOs);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) {

		CustomerOriginPO customerOriginPO = new CustomerOriginPO();

		BeanUtil.copyProperties(customerOriginVO, customerOriginPO, Arrays.asList("creater", "createTime", "belonger", "department", "region", "designer", "village"));

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

		VillagePO villagePO = villageDao.get(customerOriginVO.getVillage().getNo());

		customerOriginPO.setVillage(villagePO);

		customerOriginDao.save(customerOriginPO);

		creatCustomerRecord(customerOriginPO.getCsid(), String.format("原楼盘:%s,原楼牌号:%s原电话:%s,原目的:%s,原意向:%s,原价格:%s,原等级:%s", customerOriginPO.getVillage().getName(), customerOriginPO.getHouseNumber(), customerOriginPO.getPhone(), customerOriginPO.getPurpose(), customerOriginPO.getIntention(), customerOriginPO.getPrice(), customerOriginPO.getGrade()), (short) 1, userDao.queryUserByUserId(userId));
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
			
			creatCustomerRecord(customerOriginPO.getCsid(), String.format("原楼盘:%s,原楼牌号:%s,原电话:%s,原目的:%s,原意向:%s,原价格:%s,原等级:%s,新楼盘:%s,新楼牌号:%s,新电话:%s,新目的:%s,新意向:%s,新价格:%s,新等级:%s", oldVillageName, customerOriginPO.getHouseNumber(), customerOriginPO.getPhone(), customerOriginPO.getPurpose(), customerOriginPO.getIntention(), customerOriginPO.getPrice(), customerOriginPO.getGrade(), villagePO.getName(), customerOriginVO.getHouseNumber(), customerOriginVO.getPhone(), customerOriginVO.getPurpose(), customerOriginVO.getIntention(), customerOriginVO.getPrice(), customerOriginVO.getGrade()), (short) 0, userDao.queryUserByUserId(userId));
			customerOriginPO.setVillage(villagePO);
		}

		BeanUtil.copyPropertie(customerOriginVO, customerOriginPO, Arrays.asList("csid", "creater", "createTime", "belonger", "department", "region", "designer", "village"));

		if (customerOriginVO.getDesigner() != null && customerOriginVO.getDesigner().getUserId() != null) {
			UserPO designer = userDao.queryUserByUserId(customerOriginVO.getDesigner().getUserId());

			String userName = "";
			String dept = "";
			String region = "";

			if (customerOriginPO.getDesigner() != null) {
				userName = customerOriginPO.getDesigner().getUserName();
				dept = customerOriginPO.getDesigner().getDept().getName();
				region = customerOriginPO.getDesigner().getDept().getFatherDept().getName();
			}

			creatCustomerRecord(customerOriginPO.getCsid(), String.format("原设计师:%s,原设计师部门:%s,原设计师大区:%s,新设计师:%s,新设计师部门:%s,新设计师大区:%s", userName, dept, region, designer.getUserName(), designer.getDept().getName(), designer.getDept().getFatherDept().getName()), (short) 0, userDao.queryUserByUserId(userId));
			customerOriginPO.setDesigner(designer);
		}

		customerOriginDao.update(customerOriginPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerOriginForBelonger(CustomerOriginVO customerOriginVO, String userId) throws FLException {

		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (customerOriginPO.getStatus() != CustomerOriginPO.STATUS_INIT_INT) {
			throw new FLException(330014, "客源状态不可操作");
		}

		UserPO belonger = userDao.get(customerOriginVO.getBelonger().getUid());
		
		String oldBelongName = "";
		String oldBelongDept = "";
		String oldBelongFatherDept = "";
		
		if(customerOriginPO.getBelonger() != null){
			oldBelongName = customerOriginPO.getBelonger().getUserName();
			oldBelongDept = customerOriginPO.getBelonger().getDept().getName();
			oldBelongFatherDept = customerOriginPO.getBelonger().getDept().getFatherDept().getName();
		}
		
		creatCustomerRecord(customerOriginPO.getCsid(), String.format("原归属人:%s,原归属部门:%s,原归属分区:%s,新归属人:%s,新归属部门:%s,新归属分区:%s", oldBelongName, oldBelongDept, oldBelongFatherDept, belonger.getUserName(), belonger.getDept().getName(), belonger.getDept().getFatherDept().getName()), (short) 1, userDao.queryUserByUserId(userId));
		
		customerOriginPO.setBelonger(belonger);
		customerOriginPO.setDepartment(belonger.getDept());
		customerOriginPO.setRegion(belonger.getDept().getFatherDept());

		customerOriginDao.update(customerOriginPO);
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void bindCustomerOrigin(CustomerOriginVO customerOriginVO) throws FLException {
		
		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());
		
		if(customerOriginPO == null){
			throw new FLException(330001, "客源不存在");
		}
		
		if(customerOriginPO.getStatus() != 0){
			throw new FLException(330014, "客源状态不可操作");
		}
		
		Long cid = customerOriginVO.getCid();
		Long hid = customerOriginVO.getHid();
		
		if(cid != null){
			if(customerOriginPO.getCid() != 0){
				throw new FLException(330015, "客源不可多次绑定");
			}
			
			customerOriginPO.setCid(cid);
		}
		
		if(hid != null){
			if(customerOriginPO.getHid() != 0){
				throw new FLException(330015, "客源不可多次绑定");
			}
			HousePO housePO = houseDao.get(hid);
			customerOriginPO.setHid(hid);
			customerOriginPO.setVillage(housePO.getVillage());
			customerOriginPO.setHouseNumber(housePO.getHouseNumber());
		}
		
		if(customerOriginVO.getDesigner() != null && customerOriginVO.getDesigner().getUserId() != null){
			UserPO designerPO = userDao.queryUserByUserId(customerOriginVO.getDesigner().getUserId());
			customerOriginPO.setDesigner(designerPO);
		}
		
		customerOriginDao.update(customerOriginPO);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void freeCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException {

		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		if (customerOriginPO.getStatus() != CustomerOriginPO.STATUS_INIT_INT) {
			throw new FLException(330014, "客源状态不可操作");
		}

		if (!userId.equals(customerOriginPO.getBelonger().getUserId())) {
			throw new FLException(330002, "客源归属人错误");
		}

		creatCustomerRecord(customerOriginPO.getCsid(), String.format("原归属人姓名:%s,原归属人员工号:%s,原归属人电话:%s", customerOriginPO.getBelonger().getUserName(), userId, userDao.queryUserByUserId(userId).getPhone()), (short) 1, userDao.queryUserByUserId(userId));

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

		if (userDao.queryUserByUserId(userId) == null) {
			throw new FLException(330002, "客源归属人错误");
		}

		UserPO belonger = userDao.queryUserByUserId(userId);

		customerOriginPO.setBelonger(belonger);
		customerOriginPO.setDepartment(belonger.getDept());
		customerOriginPO.setRegion(belonger.getDept().getFatherDept());

		customerOriginDao.update(customerOriginPO);

		creatCustomerRecord(customerOriginPO.getCsid(), String.format("认领人姓名:%s,认领人员工号:%s,认领人电话:%s", userDao.queryUserByUserId(userId).getUserName(), userId, userDao.queryUserByUserId(userId).getPhone()), (short) 1, userDao.queryUserByUserId(userId));
	}

	public CustomerOriginVO customerOriginPOToVO(CustomerOriginPO customerOriginPO) {

		CustomerOriginVO customerOriginVO = new CustomerOriginVO(new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())), new VillageVO(new CityProperVO()));

		BeanUtil.copyProperties(customerOriginPO, customerOriginVO, Arrays.asList("creater", "createTime", "belonger", "department", "region", "designer", "village"));
		BeanUtil.copyProperties(customerOriginPO.getCreater(), customerOriginVO.getCreater(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(customerOriginPO.getBelonger(), customerOriginVO.getBelonger(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(customerOriginPO.getDepartment(), customerOriginVO.getDepartment(), Arrays.asList("type", "fatherDept", "manager"));
		BeanUtil.copyProperties(customerOriginPO.getRegion(), customerOriginVO.getRegion(), Arrays.asList("type", "fatherDept", "manager"));
		BeanUtil.copyProperties(customerOriginPO.getDesigner(), customerOriginVO.getDesigner(), Arrays.asList("dept", "duty"));

		if (customerOriginPO.getVillage() != null) {
			BeanUtil.copyProperties(customerOriginPO.getVillage(), customerOriginVO.getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(customerOriginPO.getVillage().getCityProper(), customerOriginVO.getVillage().getCityProper(), Arrays.asList("city"));
		}

		if (customerOriginPO.getDesigner() != null) {
			BeanUtil.copyProperties(customerOriginPO.getDesigner().getDept(), customerOriginVO.getDesigner().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(customerOriginPO.getDesigner().getDept().getFatherDept(), customerOriginVO.getDesigner().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));
		}

		customerOriginVO.setCreateTime(customerOriginPO.getCreateTime());

		return customerOriginVO;
	}

	public void creatCustomerRecord(long csid, String comment, Short type, UserPO operater) {

		CustomerRecordPO customerRecordPO = new CustomerRecordPO();

		customerRecordPO.setCsid(csid);
		customerRecordPO.setComment(comment);
		customerRecordPO.setType(type);
		customerRecordPO.setOperater(operater);
		customerRecordPO.setOperatTime(new Timestamp(System.currentTimeMillis()));

		customerRecordDao.save(customerRecordPO);
	}

}
