package com.fanglin.building.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.building.dao.BuildingDao;
import com.fanglin.building.dao.BuildingNodeDao;
import com.fanglin.building.dao.BuildingScheduleDao;
import com.fanglin.building.dao.CustomerSourceDao;
import com.fanglin.building.dao.HouseSourceDao;
import com.fanglin.building.po.BuildingNodePO;
import com.fanglin.building.po.BuildingPO;
import com.fanglin.building.po.BuildingSchedulePO;
import com.fanglin.building.po.CustomerSourcePO;
import com.fanglin.building.po.HouseSourcePO;
import com.fanglin.building.service.BuildingService;
import com.fanglin.building.vo.BuildingNodeVO;
import com.fanglin.building.vo.BuildingVO;
import com.fanglin.building.vo.CustomerSourceVO;
import com.fanglin.building.vo.HouseSourceVO;
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
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("buildingService")
@Transactional(readOnly=true)
public class BuildingServiceImpl implements BuildingService {
	
	@Autowired
	private BuildingDao buildingDao;
	
	@Autowired
	private HouseSourceDao houseSourceDao;
	
	@Autowired
	private CustomerSourceDao customerSourceDao;
	
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
	@Transactional(rollbackFor=Exception.class)
	public void bindBuilding(BuildingVO buildingVO, String userId) throws FLException {
		
		//判断房源状态
		HouseSourcePO houseSourcePO = houseSourceDao.get(buildingVO.getHouseSource().getHsid());
		
		if(houseSourcePO.getStatus() != 3){
			throw new FLException(320006, "房源状态不可操作");
		}
		
		//判断客源状态
		CustomerSourcePO customerSourcePO = customerSourceDao.get(buildingVO.getCustomerSource().getCsid());
		
		if(customerSourcePO.getStatus() != 0){
			throw new FLException(320009, "客源状态不可操作");
		}
		
		//更新房源、客源为已签约
		houseSourcePO.setStatus(HouseSourcePO.STATUS_SIGN_SHORT);
		customerSourcePO.setStatus(CustomerSourcePO.STATUS_SIGN_SHORT);
		
		UserPO createPO = userDao.queryUserByUserId(userId);
		
		Long hacid = buildingVO.getHouseSourceAgent().getCid();
		
		CustomerPO houseSourceAgentPO = null;
		
		if(hacid != null){
			houseSourceAgentPO = customerDao.get(hacid);
		}
		
		Long cacid = buildingVO.getCustomerSourceAgent().getCid();
		
		CustomerPO customerSourceAgentPO = null;
		
		if(cacid != null){
			customerSourceAgentPO = customerDao.get(cacid);
		}
		
		List<BuildingNodePO> buildingNodePOs = buildingNodeDao.queryBuildingNodeByType(buildingVO.getPayType(), null, BuildingNodePO.STATUS_ENABLE_SHORT);
		
		BuildingNodePO buildingNodePO = buildingNodePOs.get(0);
		
		BuildingPO buildingPO = new BuildingPO(houseSourcePO, customerSourcePO, houseSourceAgentPO, customerSourceAgentPO, createPO, buildingNodePO);
		BeanUtil.copyProperties(buildingVO, buildingPO, Arrays.asList("houseSource", "customerSource", "houseSourceAgent", "customerSourceAgent", "creater", "buildingNode"));
		
		BuildingSchedulePO buildingSchedulePO = new BuildingSchedulePO(buildingNodePO, buildingPO, createPO);
		
		buildingSchedulePO.setName(buildingNodePO.getName());
		
		buildingSchedulePO.setStatus(BuildingSchedulePO.STATUS_INIT_SHORT);
		
		//NO
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate);
		
		String no = "B" + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		buildingPO.setNo(no);
		
		buildingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		buildingPO.setStatus(BuildingPO.STATUS_SIGN_SHORT);
		
		houseSourceDao.update(houseSourcePO);
		customerSourceDao.update(customerSourcePO);
		buildingDao.save(buildingPO);
		buildingScheduleDao.save(buildingSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void unbindBuilding(BuildingVO buildingVO) throws FLException {
		
		//判断房产单是否存在
		BuildingPO buildingPO = buildingDao.get(buildingVO.getBid());
		
		if(buildingPO == null){
			throw new FLException(320010, "房产单不存在");
		}
		
		if(buildingPO.getStatus() != 0){
			throw new FLException(320011, "房产单状态不可操作");
		}
		
		HouseSourcePO houseSourcePO = houseSourceDao.get(buildingVO.getHouseSource().getHsid());
		CustomerSourcePO customerSourcePO = customerSourceDao.get(buildingVO.getCustomerSource().getCsid());
		
		houseSourcePO.setStatus(HouseSourcePO.STATUS_DISABLE_SHORT);
		customerSourcePO.setStatus(CustomerSourcePO.STATUS_DISABLE_SHORT);
		buildingPO.setStatus(BuildingPO.STATUS_DISABLE_SHORT);
		
		houseSourceDao.update(houseSourcePO);
		customerSourceDao.update(customerSourcePO);
		buildingDao.update(buildingPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateBuildingForBalanceStatus(BuildingVO buildingVO) throws FLException {
		
		//判断房产单是否存在
		BuildingPO buildingPO = buildingDao.get(buildingVO.getBid());
		
		if(buildingPO == null){
			throw new FLException(320010, "房产单不存在");
		}
		
		if(buildingPO.getStatus() != 0){
			throw new FLException(320011, "房产单状态不可操作");
		}
		
		buildingPO.setBalanceStatus(buildingVO.getBalanceStatus());
		
		buildingDao.update(buildingPO);
		
	}
	
	public BuildingVO buildingPOToVO(BuildingPO buildingPO){
		
		HouseVO houseVO = new HouseVO(new VillageVO(new CityProperVO()));
		HouseSourceVO houseSourceVO = new HouseSourceVO(houseVO, new CustomerVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());
		CustomerSourceVO customerSourceVO = new CustomerSourceVO(new CustomerVO(), new UserBaseVO());
		
		//houseSource
		HouseSourcePO houseSourcePO = buildingPO.getHouseSource();
		BeanUtil.copyProperties(houseSourcePO, houseSourceVO, Arrays.asList("house", "customer", "create", "followUser", "keyer", "department", "region"));
		BeanUtil.copyProperties(houseSourcePO.getHouse(), houseSourceVO.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(houseSourcePO.getHouse().getVillage(), houseSourceVO.getHouse().getVillage(), Arrays.asList("cityProper"));
		BeanUtil.copyProperties(houseSourcePO.getHouse().getVillage().getCityProper(), houseSourceVO.getHouse().getVillage().getCityProper(), Arrays.asList("city"));
		BeanUtil.copyProperties(houseSourcePO.getCustomer(), houseSourceVO.getCustomer());
		BeanUtil.copyProperties(houseSourcePO.getCreate(), houseSourceVO.getCreate(), Arrays.asList("dept", "duty"));
		
		if(houseSourcePO.getFollowUser() != null){
			BeanUtil.copyProperties(houseSourcePO.getFollowUser(), houseSourceVO.getFollowUser(), Arrays.asList("dept", "duty"));
		}
		
		if(houseSourcePO.getKeyer() != null){
			BeanUtil.copyProperties(houseSourcePO.getKeyer(), houseSourceVO.getKeyer(), Arrays.asList("dept", "duty"));
		}
		
		if(houseSourcePO.getDepartment() != null){
			BeanUtil.copyProperties(houseSourcePO.getDepartment(), houseSourceVO.getDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
		}

		if(houseSourcePO.getRegion() != null){
			BeanUtil.copyProperties(houseSourcePO.getRegion(), houseSourceVO.getRegion(), Arrays.asList("type", "fatherDept", "cityProper"));
		}
		
		//customerSource
		CustomerSourcePO customerSourcePO = buildingPO.getCustomerSource();
		BeanUtil.copyProperties(customerSourcePO, customerSourceVO, Arrays.asList("customer", "create"));
		BeanUtil.copyProperties(customerSourcePO.getCustomer(), customerSourceVO.getCustomer());
		BeanUtil.copyProperties(customerSourcePO.getCreate(), customerSourceVO.getCreate(), Arrays.asList("dept", "duty"));
		
		BuildingVO buildingVO = new BuildingVO(houseSourceVO, customerSourceVO, new CustomerVO(), new CustomerVO(), new UserBaseVO(), new BuildingNodeVO());
		BeanUtil.copyProperties(buildingPO, buildingVO, Arrays.asList("houseSource", "customerSource", "houseSourceAgent", "customerSourceAgent", "creater", "buildingNode"));
		
		//houseSourceAgent
		if(buildingPO.getHouseSourceAgent() != null){
			BeanUtil.copyProperties(buildingPO.getHouseSourceAgent(), buildingVO.getHouseSourceAgent());
		}
		
		//customerSourceAgent
		if(buildingPO.getCustomerSource() != null){
			BeanUtil.copyProperties(buildingPO.getCustomerSourceAgent(), buildingVO.getCustomerSourceAgent());
		}
		
		//creater
		BeanUtil.copyProperties(buildingPO.getCreater(), buildingVO.getCreater(), Arrays.asList("dept", "duty"));
		
		//buildingNode
		BeanUtil.copyProperties(buildingPO.getBuildingNode(), buildingVO.getBuildingNode());
		
		return buildingVO;
	}

}
