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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.CustomerDao;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.HouseVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
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
			buildingVOs.add(BuildingPOToVO(buildingPO));
		}
		
		paging.setData(buildingVOs);
		
	}

	@Override
	public BuildingVO queryBuildingByBoid(BuildingVO building) {
		
		BuildingPO buildingPO = buildingDao.get(building.getBoid());
		
		BuildingVO buildingVO = BuildingPOToVO(buildingPO);
		
		return buildingVO;
	}
	
	@Override
	public BuildingVO queryBuilding(BuildingVO building) throws FLException {
		
		BuildingPO buildingPO = null;
		
		if(building.getHouseSource() != null){
			buildingPO = buildingDao.queryBuildingByHsid(building.getHouseSource().getHsid());
		}else if(building.getCustomerSource() != null){
			buildingPO = buildingDao.queryBuildingByCsid(building.getCustomerSource().getCsid());
		}
		
		if(buildingPO == null){
			throw new FLException(320010, "房产单不存在");
		}
		
		BuildingVO buildingVO = BuildingPOToVO(buildingPO);
		
		return buildingVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void bindBuilding(BuildingVO buildingVO, String userId) throws FLException {
		
		//判断房源状态
		HouseSourcePO houseSourcePO = houseSourceDao.get(buildingVO.getHouseSource().getHsid());
		
		if(houseSourcePO.getStatus() != 0){
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
		
		List<BuildingNodePO> buildingNodes = buildingNodeDao.queryBuildingNodeByType(buildingVO.getPayType());
		
		BuildingNodePO buildingNodePO = buildingNodes.get(0);
		BuildingPO buildingPO = new BuildingPO(houseSourcePO, customerSourcePO, houseSourceAgentPO, customerSourceAgentPO, createPO, buildingNodePO);
		BeanUtil.copyProperties(buildingVO, buildingPO, Arrays.asList("houseSource", "customerSource", "houseSourceAgent", "customerSourceAgent", "creater", "buildingNode"));
		
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
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void unbindBuilding(BuildingVO buildingVO) throws FLException {
		
		//判断房产单是否存在
		BuildingPO buildingPO = buildingDao.get(buildingVO.getBoid());
		
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
		BuildingPO buildingPO = buildingDao.get(buildingVO.getBoid());
		
		if(buildingPO == null){
			throw new FLException(320010, "房产单不存在");
		}
		
		if(buildingPO.getStatus() != 0){
			throw new FLException(320011, "房产单状态不可操作");
		}
		
		buildingPO.setBalanceStatus(buildingVO.getBalanceStatus());
		
		buildingDao.update(buildingPO);
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateBuildingForPayType(BuildingVO buildingVO, String userId) throws FLException {
		
		BuildingPO buildingPO = buildingDao.get(buildingVO.getBoid());
		
		if(buildingPO == null){
			throw new FLException(320010, "房产单不存在");
		}
		
		if(buildingPO.getStatus() != 0){
			throw new FLException(320011, "房产单状态不可操作");
		}
		
		buildingPO.setPayType(buildingVO.getPayType());
		
		buildingDao.update(buildingPO);
		
		//修改当前房产单的房产流转
		UserPO operaterPO = userDao.queryUserByUserId(userId);
		List<BuildingSchedulePO> buildingSchedules = buildingScheduleDao.queryBuildingScheduleByBoid(buildingVO.getBoid());
		
		for (BuildingSchedulePO buildingSchedulePO : buildingSchedules) {
			
			buildingSchedulePO.setStatus(BuildingSchedulePO.STATUS_DISABLE_SHORT);
			
			buildingSchedulePO.setOperater(operaterPO);
			
			buildingSchedulePO.setOperatTime(new Timestamp(System.currentTimeMillis()));
			
			buildingScheduleDao.update(buildingSchedulePO);
		}
		
		//生成新的房产单流转节点
		
		List<BuildingNodePO> buildingNodes = buildingNodeDao.queryBuildingNodeByType(buildingVO.getPayType());
		
		BuildingSchedulePO buildingSchedulePO = new BuildingSchedulePO(buildingNodes.get(0), buildingPO, operaterPO);
		
		buildingSchedulePO.setName(buildingNodes.get(0).getName());
		
		buildingSchedulePO.setStatus(BuildingSchedulePO.STATUS_INIT_SHORT);
		
		buildingSchedulePO.setOperatTime(new Timestamp(System.currentTimeMillis()));
		
		buildingScheduleDao.save(buildingSchedulePO);
		
	}
	
	public BuildingVO BuildingPOToVO(BuildingPO buildingPO){
		
		HouseVO houseVO = new HouseVO(new VillageVO(new CityProperVO()));
		HouseSourceVO houseSourceVO = new HouseSourceVO(houseVO, new CustomerVO(), new UserVO(), new UserVO());
		CustomerSourceVO customerSourceVO = new CustomerSourceVO(new CustomerVO(), new UserVO());
		BuildingVO buildingVO = new BuildingVO(houseSourceVO, customerSourceVO, new CustomerVO(), new CustomerVO(), new UserVO(), new BuildingNodeVO());
		BeanUtil.copyProperties(buildingPO, buildingVO, Arrays.asList("houseSource", "customerSource", "houseSourceAgent", "customerSourceAgent", "creater", "buildingNode"));
		
		//houseSource
		BeanUtil.copyProperties(buildingPO.getHouseSource(), buildingVO.getHouseSource(), Arrays.asList("house", "customer", "create", "followUser"));
		BeanUtil.copyProperties(buildingPO.getHouseSource().getHouse(), buildingVO.getHouseSource().getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(buildingPO.getHouseSource().getHouse().getVillage(), buildingVO.getHouseSource().getHouse().getVillage(), Arrays.asList("cityProper"));
		BeanUtil.copyProperties(buildingPO.getHouseSource().getHouse().getVillage().getCityProper(), buildingVO.getHouseSource().getHouse().getVillage().getCityProper(), Arrays.asList("city"));
		BeanUtil.copyProperties(buildingPO.getHouseSource().getCustomer(), buildingVO.getHouseSource().getCustomer());
		BeanUtil.copyProperties(buildingPO.getHouseSource().getCreate(), buildingVO.getHouseSource().getCreate(), Arrays.asList("role", "dept", "duty"));
		BeanUtil.copyProperties(buildingPO.getHouseSource().getFollowUser(), buildingVO.getHouseSource().getFollowUser(), Arrays.asList("role", "dept", "duty"));
		
		//customerSource
		BeanUtil.copyProperties(buildingPO.getCustomerSource(), buildingVO.getCustomerSource(), Arrays.asList("customer", "create"));
		BeanUtil.copyProperties(buildingPO.getCustomerSource().getCustomer(), buildingVO.getCustomerSource().getCustomer());
		BeanUtil.copyProperties(buildingPO.getCustomerSource().getCreate(), buildingVO.getCustomerSource().getCreate(), Arrays.asList("role", "dept", "duty"));
		
		//houseSourceAgent
		if(buildingPO.getHouseSourceAgent() != null){
			BeanUtil.copyProperties(buildingPO.getHouseSourceAgent(), buildingVO.getHouseSourceAgent());
		}
		
		//customerSourceAgent
		if(buildingPO.getCustomerSource() != null){
			BeanUtil.copyProperties(buildingPO.getCustomerSourceAgent(), buildingVO.getCustomerSourceAgent());
		}
		
		//creater
		BeanUtil.copyProperties(buildingPO.getCreater(), buildingVO.getCreater(), Arrays.asList("role", "dept", "duty"));
		
		//buildingNode
		BeanUtil.copyProperties(buildingPO.getBuildingNode(), buildingVO.getBuildingNode());
		
		return buildingVO;
	}

}
