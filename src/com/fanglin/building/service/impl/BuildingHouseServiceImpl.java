package com.fanglin.building.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.building.dao.BuildingDao;
import com.fanglin.building.dao.BuildingHouseDao;
import com.fanglin.building.po.BuildingCustomerPO;
import com.fanglin.building.po.BuildingHousePO;
import com.fanglin.building.po.BuildingPO;
import com.fanglin.building.po.BuildingRecordPO;
import com.fanglin.building.service.BuildingHouseService;
import com.fanglin.building.service.BuildingRecordService;
import com.fanglin.building.vo.BuildingHouseVO;
import com.fanglin.building.vo.BuildingRecordVO;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.right.dao.BuildingHouseRightDao;
import com.fanglin.right.po.BuildingHouseDepartmentRightPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("buildingHouseService")
@Transactional(readOnly = true)
public class BuildingHouseServiceImpl implements BuildingHouseService {

	@Autowired
	private BuildingHouseDao buildingHouseDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private HouseDao houseDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private CustomerPhoneDao customerPhoneDao;

	@Autowired
	private BuildingDao buildingDao;

	@Autowired
	private BuildingHouseRightDao buildingHouseRightDao;

	@Autowired
	private BuildingRecordService buildingRecordService;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public void pageBuildingHouse(Paging paging, List<Filter> filters) {

		if (filters.size() == 0) return;

		List<BuildingHousePO> buildingHousePOs = buildingHouseDao.pageBuildingHouse(paging, filters, null);
		List<BuildingHouseVO> buildingHouseVOs = new ArrayList<BuildingHouseVO>();

		for (BuildingHousePO buildingHousePO : buildingHousePOs) {
			BuildingHouseVO buildingHouseVO = buildingHousePOToVO(buildingHousePO);
			buildingHouseVOs.add(buildingHouseVO);
		}

		paging.setData(buildingHouseVOs);

	}

	@Override
	public void pageBuildingHouseForFollower(Paging paging, List<Filter> filters, String userId) {

		if (filters.size() == 0) return;

		UserPO userPO = userDao.queryUserByUserId(userId);

		Filter filter = new Filter();
		filter.setData(String.valueOf(userPO.getUid()));
		filter.setField("followUser");
		filter.setOp("eq");
		filters.add(filter);

		List<BuildingHousePO> buildingHousePOs = buildingHouseDao.pageBuildingHouse(paging, filters, null);
		List<BuildingHouseVO> buildingHouseVOs = new ArrayList<BuildingHouseVO>();

		for (BuildingHousePO buildingHousePO : buildingHousePOs) {
			BuildingHouseVO buildingHouseVO = buildingHousePOToVO(buildingHousePO);
			buildingHouseVOs.add(buildingHouseVO);
		}

		paging.setData(buildingHouseVOs);

	}

	@Override
	public void pageBuildingHouseForAdvance(Paging paging, List<Filter> filters, String userId) {

		if (filters.size() == 0) return;

		UserPO userPO = userDao.queryUserByUserId(userId);
		List<BuildingHouseDepartmentRightPO> buildingHouseDepartmentRightPOs = buildingHouseRightDao.queryBuildingHouseDepartmentRightByUid(userPO.getUid(), userPO.getCompany());
		List<Integer> dids = new ArrayList<Integer>();

		for (BuildingHouseDepartmentRightPO buildingHouseDepartmentRightPO : buildingHouseDepartmentRightPOs) {
			dids.add(buildingHouseDepartmentRightPO.getDid());
		}

		if (dids.size() == 0) return;

		if (dids.size() == 1 && dids.get(0) == BuildingHouseDepartmentRightPO.DEPARTMENT_ALL_ENABLE_INT) {
			dids = null;
		}

		List<BuildingHousePO> buildingHousePOs = buildingHouseDao.pageBuildingHouse(paging, filters, dids);
		List<BuildingHouseVO> buildingHouseVOs = new ArrayList<BuildingHouseVO>();

		for (BuildingHousePO buildingHousePO : buildingHousePOs) {
			BuildingHouseVO buildingHouseVO = buildingHousePOToVO(buildingHousePO);
			buildingHouseVOs.add(buildingHouseVO);
		}

		paging.setData(buildingHouseVOs);

	}

	@Override
	public BuildingHouseVO queryBuildingHouseByHsid(BuildingHouseVO buildingHouse) {

		BuildingHousePO buildingHousePO = buildingHouseDao.get(buildingHouse.getHsid());
		BuildingHouseVO buildingHouseVO = buildingHousePOToVO(buildingHousePO);

		return buildingHouseVO;
	}

	@Override
	public BuildingHouseVO queryBuildingHouseByNo(BuildingHouseVO buildingHouse) throws FLException {

		BuildingHousePO buildingHousePO = buildingHouseDao.queryBuildingHouseByNo(buildingHouse.getNo());

		if (buildingHousePO == null) {
			throw new FLException(320005, "房源不存在");
		}

		BuildingHouseVO buildingHouseVO = buildingHousePOToVO(buildingHousePO);

		return buildingHouseVO;
	}

	@Override
	public BuildingHouseVO checkBuildingHouse(BuildingHouseVO buildingHouse) throws FLException {

		BuildingHousePO buildingHousePO = buildingHouseDao.checkBuildingHouse(buildingHouse.getHouse().getHid(), buildingHouse.getType());

		if (buildingHousePO == null) {
			throw new FLException(320005, "房源不存在");
		}

		BuildingHouseVO buildingHouseVO = buildingHousePOToVO(buildingHousePO);

		return buildingHouseVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addBuildingHouse(BuildingHouseVO buildingHouseVO, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		Integer houseCount = buildingHouseDao.countBuildingHouse(buildingHouseVO.getHouse().getHid(), buildingHouseVO.getType());

		if (houseCount > 0) {
			throw new FLException(320004, "房源已存在");
		}

		UserPO createPO = userDao.queryUserByUserId(userId);
		UserPO followPO = userDao.queryUserByUserId(buildingHouseVO.getFollowUser().getUserId());
		HousePO housePO = houseDao.get(buildingHouseVO.getHouse().getHid());
		CustomerPO customerPO = customerDao.get(buildingHouseVO.getCustomer().getCid());

		UserPO keyer = null;
		DepartmentPO department = followPO.getDept();
		DepartmentPO region = followPO.getDept().getFatherDept();

		if (!buildingHouseVO.getKeyer().getUserId().equals("")) {
			keyer = userDao.queryUserByUserId(buildingHouseVO.getKeyer().getUserId());
		}

		BuildingHousePO buildingHousePO = new BuildingHousePO(housePO, customerPO, createPO, followPO, keyer, department, region);
		BeanUtil.copyProperties(buildingHouseVO, buildingHousePO, Arrays.asList("house", "customer", "create", "followUser", "keyer", "department", "region"));

		buildingHousePO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		buildingHousePO.setStatus(BuildingHousePO.STATUS_INIT_SHORT);
		// NO
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate, company);

		String no = companyPO.getShortname() + "H" + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		buildingHousePO.setNo(no);

		buildingHouseDao.save(buildingHousePO);

		if (!buildingHouseVO.getKeyer().getUserId().equals("")) {
			keyerRecord(buildingHousePO, buildingHouseVO.getKeyer().getUserId());
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void takeBuildingHouse(BuildingHouseVO buildingHouseVO, String userId) throws FLException {

		BuildingHousePO buildingHousePO = buildingHouseDao.get(buildingHouseVO.getHsid());

		if (buildingHousePO == null) {
			throw new FLException(320005, "房源不存在");
		}

		if (buildingHousePO.getFollowUser() != null) {
			throw new FLException(320006, "房源状态不可操作");
		}

		UserPO taker = userDao.queryUserByUserId(userId);

		buildingHousePO.setFollowUser(taker);

		buildingHousePO.setDepartment(taker.getDept());

		buildingHousePO.setRegion(taker.getDept().getFatherDept());

		buildingHouseDao.update(buildingHousePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBuildingHouse(BuildingHouseVO buildingHouseVO) throws FLException {

		BuildingHousePO buildingHousePO = buildingHouseDao.get(buildingHouseVO.getHsid());

		if (buildingHousePO == null) {
			throw new FLException(320005, "房源不存在");
		}

		if (buildingHousePO.getStatus() == 2) {
			throw new FLException(320006, "房源状态不可操作");
		}

		UserPO keyer = userDao.queryUserByUserId(buildingHouseVO.getKeyer().getUserId());

		BeanUtil.copyProperties(buildingHouseVO, buildingHousePO, Arrays.asList("house", "customer", "create", "followUser", "keyer", "department", "region"));

		buildingHousePO.setKeyer(keyer);

		buildingHouseDao.update(buildingHousePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBuildingHouseForBelong(BuildingHouseVO buildingHouseVO) throws FLException {

		BuildingHousePO buildingHousePO = buildingHouseDao.get(buildingHouseVO.getHsid());

		if (buildingHousePO == null) {
			throw new FLException(320005, "房源不存在");
		}

		if (buildingHousePO.getStatus() == 2) {
			throw new FLException(320006, "房源状态不可操作");
		}

		UserPO followUserPO = userDao.queryUserByUserId(buildingHouseVO.getFollowUser().getUserId());

		buildingHousePO.setFollowUser(followUserPO);

		buildingHousePO.setDepartment(followUserPO.getDept());

		buildingHousePO.setRegion(followUserPO.getDept().getFatherDept());

		buildingHouseDao.update(buildingHousePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBuildingHouseForKeyer(BuildingHouseVO buildingHouseVO) throws FLException {

		BuildingHousePO buildingHousePO = buildingHouseDao.get(buildingHouseVO.getHsid());

		if (buildingHousePO == null) {
			throw new FLException(320005, "房源不存在");
		}

		if (buildingHousePO.getStatus() == 2) {
			throw new FLException(320006, "房源状态不可操作");
		}

		String keyerId = buildingHouseVO.getKeyer().getUserId();

		UserPO keyerPO = userDao.queryUserByUserId(keyerId);

		buildingHousePO.setKeyer(keyerPO);

		buildingHouseDao.update(buildingHousePO);

		keyerRecord(buildingHousePO, keyerId);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBuildingHouseForStatus(BuildingHouseVO buildingHouseVO) throws FLException {

		BuildingHousePO buildingHousePO = buildingHouseDao.get(buildingHouseVO.getHsid());

		if (buildingHousePO == null) {
			throw new FLException(320005, "房源不存在");
		}

		if (buildingHouseVO.getStatus() == 0) {
			BuildingPO buildingPO = buildingDao.queryBuildingByHsid(buildingHouseVO.getHsid());

			if (buildingPO != null) {
				throw new FLException(320006, "房源状态不可操作");
			}
		}

		buildingHousePO.setStatus(buildingHouseVO.getStatus());

		buildingHouseDao.update(buildingHousePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBuildingHouseForPath(BuildingHouseVO buildingHouseVO) throws FLException {

		BuildingHousePO buildingHousePO = buildingHouseDao.get(buildingHouseVO.getHsid());

		if (buildingHousePO == null) {
			throw new FLException(320005, "房源不存在");
		}

		buildingHousePO.setPath(buildingHouseVO.getPath());

		buildingHouseDao.update(buildingHousePO);

	}

	public BuildingHouseVO buildingHousePOToVO(BuildingHousePO buildingHousePO) {

		VillageVO villageVO = new VillageVO(new CityProperVO());

		BuildingHouseVO buildingHouseVO = new BuildingHouseVO(new HouseVO(villageVO), new CustomerVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());

		BeanUtil.copyProperties(buildingHousePO, buildingHouseVO, Arrays.asList("house", "customer", "create", "followUser", "keyer", "department", "region"));
		BeanUtil.copyProperties(buildingHousePO.getHouse(), buildingHouseVO.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(buildingHousePO.getHouse().getVillage(), buildingHouseVO.getHouse().getVillage(), Arrays.asList("cityProper"));
		BeanUtil.copyProperties(buildingHousePO.getHouse().getVillage().getCityProper(), buildingHouseVO.getHouse().getVillage().getCityProper(), Arrays.asList("city"));
		BeanUtil.copyProperties(buildingHousePO.getCustomer(), buildingHouseVO.getCustomer());

		if (buildingHousePO.getCreate() != null) {
			BeanUtil.copyProperties(buildingHousePO.getCreate(), buildingHouseVO.getCreate(), Arrays.asList("dept", "duty"));
		}

		if (buildingHousePO.getFollowUser() != null) {
			BeanUtil.copyProperties(buildingHousePO.getFollowUser(), buildingHouseVO.getFollowUser(), Arrays.asList("dept", "duty"));
		}

		if (buildingHousePO.getKeyer() != null) {
			BeanUtil.copyProperties(buildingHousePO.getKeyer(), buildingHouseVO.getKeyer(), Arrays.asList("dept", "duty"));
		}

		if (buildingHousePO.getDepartment() != null) {
			BeanUtil.copyProperties(buildingHousePO.getDepartment(), buildingHouseVO.getDepartment(), Arrays.asList("type", "fatherDept", "manager"));
		}

		if (buildingHousePO.getRegion() != null) {
			BeanUtil.copyProperties(buildingHousePO.getRegion(), buildingHouseVO.getRegion(), Arrays.asList("type", "fatherDept", "manager"));
		}

		BeanUtil.copyProperties(buildingHousePO.getCustomer(), buildingHouseVO.getCustomer());
		List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhoneByCid(buildingHousePO.getCustomer().getCid(), BuildingCustomerPO.STATUS_INIT_SHORT);

		if (customerPhones.size() > 0) {
			buildingHouseVO.getCustomer().setPhone(customerPhones.get(0).getPhone());
		}

		return buildingHouseVO;
	}

	// 生成钥匙记录
	public void keyerRecord(BuildingHousePO buildingHousePO, String keyerId) {

		BuildingRecordVO buildingRecordVO = new BuildingRecordVO(new BuildingHouseVO(), new UserBaseVO());

		BeanUtil.copyPropertie(buildingHousePO, buildingRecordVO.getBuildingHouse(), Arrays.asList("house", "customer", "create", "followUser", "keyer", "department", "region"));

		buildingRecordVO.setType(BuildingRecordPO.COLUMN_TYPE_SHORT_THR);

		buildingRecordVO.setPattern(BuildingRecordPO.COLUMN_PATTERN_SHORT_FOUR);

		buildingRecordVO.setComment("收钥匙");

		buildingRecordService.addBuildingRecord(buildingRecordVO, keyerId);
	}

}
