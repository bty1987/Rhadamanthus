package com.fanglin.building.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.building.dao.BuildingCustomerDao;
import com.fanglin.building.dao.BuildingDao;
import com.fanglin.building.dao.BuildingHouseDao;
import com.fanglin.building.dao.BuildingNodeDao;
import com.fanglin.building.dao.BuildingScheduleDao;
import com.fanglin.building.po.BuildingCustomerPO;
import com.fanglin.building.po.BuildingHousePO;
import com.fanglin.building.po.BuildingNodePO;
import com.fanglin.building.po.BuildingPO;
import com.fanglin.building.po.BuildingSchedulePO;
import com.fanglin.building.service.BuildingService;
import com.fanglin.building.vo.BuildingCustomerVO;
import com.fanglin.building.vo.BuildingHouseVO;
import com.fanglin.building.vo.BuildingNodeVO;
import com.fanglin.building.vo.BuildingVO;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("buildingService")
@Transactional(readOnly = true)
public class BuildingServiceImpl implements BuildingService {

	@Autowired
	private BuildingDao buildingDao;

	@Autowired
	private BuildingHouseDao buildingHouseDao;

	@Autowired
	private BuildingCustomerDao buildingCustomerDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BuildingNodeDao buildingNodeDao;

	@Autowired
	private BuildingScheduleDao buildingScheduleDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public void pageBuilding(Paging paging, List<Filter> filters) {

		List<BuildingPO> buildingPOs = buildingDao.pageBuilding(paging, filters);
		List<BuildingVO> buildingVOs = new ArrayList<BuildingVO>();

		for (BuildingPO buildingPO : buildingPOs) {
			buildingVOs.add(buildingPOToVO(buildingPO));
		}

		paging.setData(buildingVOs);

	}

	@Override
	public BuildingVO queryBuildingByBid(BuildingVO building) {

		BuildingPO buildingPO = buildingDao.get(building.getBid());

		BuildingVO buildingVO = buildingPOToVO(buildingPO);

		return buildingVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void bindBuilding(BuildingVO buildingVO, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		// 判断房源状态
		BuildingHousePO buildingHousePO = buildingHouseDao.get(buildingVO.getBuildingHouse().getHsid());

		if (buildingHousePO.getStatus() != 3) {
			throw new FLException(320006, "房源状态不可操作");
		}

		// 判断客源状态
		BuildingCustomerPO buildingCustomerPO = buildingCustomerDao.get(buildingVO.getBuildingCustomer().getCsid());

		if (buildingCustomerPO.getStatus() != 0) {
			throw new FLException(320009, "客源状态不可操作");
		}

		// 更新房源、客源为已签约
		buildingHousePO.setStatus(BuildingHousePO.STATUS_SIGN_SHORT);
		buildingCustomerPO.setStatus(BuildingCustomerPO.STATUS_SIGN_SHORT);

		UserPO createPO = userDao.queryUserByUserId(userId);

		Long hacid = buildingVO.getBuildingHouseAgent().getCid();

		CustomerPO buildingHouseAgentPO = null;

		if (hacid != null) {
			buildingHouseAgentPO = customerDao.get(hacid);
		}

		Long cacid = buildingVO.getBuildingCustomerAgent().getCid();

		CustomerPO buildingCustomerAgentPO = null;

		if (cacid != null) {
			buildingCustomerAgentPO = customerDao.get(cacid);
		}

		List<BuildingNodePO> buildingNodePOs = buildingNodeDao.queryBuildingNodeByType(buildingVO.getPayType(), null, BuildingNodePO.STATUS_ENABLE_SHORT);

		BuildingNodePO buildingNodePO = buildingNodePOs.get(0);

		BuildingPO buildingPO = new BuildingPO(buildingHousePO, buildingCustomerPO, buildingHouseAgentPO, buildingCustomerAgentPO, createPO, buildingNodePO);
		BeanUtil.copyProperties(buildingVO, buildingPO, Arrays.asList("buildingHouse", "buildingCustomer", "buildingHouseAgent", "buildingCustomerAgent", "creater", "buildingNode"));

		BuildingSchedulePO buildingSchedulePO = new BuildingSchedulePO(buildingNodePO, buildingPO, createPO);

		buildingSchedulePO.setName(buildingNodePO.getName());

		buildingSchedulePO.setStatus(BuildingSchedulePO.STATUS_INIT_SHORT);

		// NO
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate, company);

		String no = companyPO.getShortname() + "B" + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		buildingPO.setNo(no);

		buildingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		buildingPO.setStatus(BuildingPO.STATUS_SIGN_SHORT);

		buildingHouseDao.update(buildingHousePO);
		buildingCustomerDao.update(buildingCustomerPO);
		buildingDao.save(buildingPO);
		buildingScheduleDao.save(buildingSchedulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void unbindBuilding(BuildingVO buildingVO) throws FLException {

		// 判断房产单是否存在
		BuildingPO buildingPO = buildingDao.get(buildingVO.getBid());

		if (buildingPO == null) {
			throw new FLException(320010, "房产单不存在");
		}

		if (buildingPO.getStatus() != 0) {
			throw new FLException(320011, "房产单状态不可操作");
		}

		BuildingHousePO buildingHousePO = buildingHouseDao.get(buildingVO.getBuildingHouse().getHsid());
		BuildingCustomerPO buildingCustomerPO = buildingCustomerDao.get(buildingVO.getBuildingCustomer().getCsid());

		buildingHousePO.setStatus(BuildingHousePO.STATUS_DISABLE_SHORT);
		buildingCustomerPO.setStatus(BuildingCustomerPO.STATUS_DISABLE_SHORT);
		buildingPO.setStatus(BuildingPO.STATUS_DISABLE_SHORT);

		buildingHouseDao.update(buildingHousePO);
		buildingCustomerDao.update(buildingCustomerPO);
		buildingDao.update(buildingPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBuildingForBalanceStatus(BuildingVO buildingVO) throws FLException {

		// 判断房产单是否存在
		BuildingPO buildingPO = buildingDao.get(buildingVO.getBid());

		if (buildingPO == null) {
			throw new FLException(320010, "房产单不存在");
		}

		if (buildingPO.getStatus() != 0) {
			throw new FLException(320011, "房产单状态不可操作");
		}

		buildingPO.setBalanceStatus(buildingVO.getBalanceStatus());

		buildingDao.update(buildingPO);

	}

	public BuildingVO buildingPOToVO(BuildingPO buildingPO) {

		HouseVO houseVO = new HouseVO(new VillageVO(new CityProperVO()));

		BuildingHouseVO buildingHouseVO = new BuildingHouseVO(houseVO, new CustomerVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());
		BuildingCustomerVO buildingCustomerVO = new BuildingCustomerVO(new CustomerVO(), new UserBaseVO());

		// buildingHouse
		BuildingHousePO buildingHousePO = buildingPO.getBuildingHouse();
		BeanUtil.copyProperties(buildingHousePO, buildingHouseVO, Arrays.asList("house", "customer", "create", "followUser", "keyer", "department", "region"));
		BeanUtil.copyProperties(buildingHousePO.getHouse(), buildingHouseVO.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(buildingHousePO.getHouse().getVillage(), buildingHouseVO.getHouse().getVillage(), Arrays.asList("cityProper"));
		BeanUtil.copyProperties(buildingHousePO.getHouse().getVillage().getCityProper(), buildingHouseVO.getHouse().getVillage().getCityProper(), Arrays.asList("city"));
		BeanUtil.copyProperties(buildingHousePO.getCustomer(), buildingHouseVO.getCustomer());
		BeanUtil.copyProperties(buildingHousePO.getCreate(), buildingHouseVO.getCreate(), Arrays.asList("dept", "duty"));

		if (buildingHousePO.getFollowUser() != null) {
			BeanUtil.copyProperties(buildingHousePO.getFollowUser(), buildingHouseVO.getFollowUser(), Arrays.asList("dept", "duty"));
		}

		if (buildingHousePO.getKeyer() != null) {
			BeanUtil.copyProperties(buildingHousePO.getKeyer(), buildingHouseVO.getKeyer(), Arrays.asList("dept", "duty"));
		}

		if (buildingHousePO.getDepartment() != null) {
			BeanUtil.copyProperties(buildingHousePO.getDepartment(), buildingHouseVO.getDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
		}

		if (buildingHousePO.getRegion() != null) {
			BeanUtil.copyProperties(buildingHousePO.getRegion(), buildingHouseVO.getRegion(), Arrays.asList("type", "fatherDept", "cityProper"));
		}

		// buildingCustomer
		BuildingCustomerPO buildingCustomerPO = buildingPO.getBuildingCustomer();
		BeanUtil.copyProperties(buildingCustomerPO, buildingCustomerVO, Arrays.asList("customer", "create"));
		BeanUtil.copyProperties(buildingCustomerPO.getCustomer(), buildingCustomerVO.getCustomer());
		BeanUtil.copyProperties(buildingCustomerPO.getCreate(), buildingCustomerVO.getCreate(), Arrays.asList("dept", "duty"));

		BuildingVO buildingVO = new BuildingVO(buildingHouseVO, buildingCustomerVO, new CustomerVO(), new CustomerVO(), new UserBaseVO(), new BuildingNodeVO());
		BeanUtil.copyProperties(buildingPO, buildingVO, Arrays.asList("buildingHouse", "buildingCustomer", "buildingHouseAgent", "buildingCustomerAgent", "creater", "buildingNode"));

		// buildingHouseAgent
		if (buildingPO.getBuildingHouseAgent() != null) {
			BeanUtil.copyProperties(buildingPO.getBuildingHouseAgent(), buildingVO.getBuildingHouseAgent());
		}

		// buildingCustomerAgent
		if (buildingPO.getBuildingCustomer() != null) {
			BeanUtil.copyProperties(buildingPO.getBuildingCustomerAgent(), buildingVO.getBuildingCustomerAgent());
		}

		// creater
		BeanUtil.copyProperties(buildingPO.getCreater(), buildingVO.getCreater(), Arrays.asList("dept", "duty"));

		// buildingNode
		BeanUtil.copyProperties(buildingPO.getBuildingNode(), buildingVO.getBuildingNode());

		return buildingVO;
	}

}
