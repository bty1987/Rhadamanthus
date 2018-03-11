package com.fanglin.building.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.building.dao.BuildingDao;
import com.fanglin.building.dao.HouseSourceDao;
import com.fanglin.building.po.BuildingPO;
import com.fanglin.building.po.CustomerSourcePO;
import com.fanglin.building.po.HouseSourcePO;
import com.fanglin.building.service.HouseSourceService;
import com.fanglin.building.vo.HouseSourceVO;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("houseSourceService")
@Transactional(readOnly=true)
public class HouseSourceServiceImpl implements HouseSourceService {
	
	@Autowired
	private HouseSourceDao houseSourceDao;
	
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
	
	@Override
	public void pageHouseSource(Paging paging, List<Filter> filters) {
		
		List<HouseSourcePO> houseSourcePOs = houseSourceDao.pageHouseSource(paging, filters);
		List<HouseSourceVO> houseSourceVOs = new ArrayList<HouseSourceVO>();
		
		for (HouseSourcePO houseSourcePO : houseSourcePOs) {
			HouseSourceVO houseSourceVO = houseSourcePOToVO(houseSourcePO);
			houseSourceVOs.add(houseSourceVO);
		}
		
		paging.setData(houseSourceVOs);

	}

	@Override
	public HouseSourceVO queryHouseSourceByHsid(HouseSourceVO houseSource) {
		
		HouseSourcePO houseSourcePO = houseSourceDao.get(houseSource.getHsid());
		HouseSourceVO houseSourceVO = houseSourcePOToVO(houseSourcePO);
		
		return houseSourceVO;
	}
	
	@Override
	public HouseSourceVO queryHouseSourceByNo(HouseSourceVO houseSource) throws FLException {
		
		HouseSourcePO houseSourcePO = houseSourceDao.queryHouseSourceByNo(houseSource.getNo());
		
		if(houseSourcePO == null){
			throw new FLException(320005, "房源不存在");
		}
		
		HouseSourceVO houseSourceVO = houseSourcePOToVO(houseSourcePO);
		
		return houseSourceVO;
	}
	
	@Override
	public HouseSourceVO checkHouseSource(HouseSourceVO houseSource) throws FLException {
		
		HouseSourcePO houseSourcePO = houseSourceDao.checkHouseSource(houseSource.getHouse().getHid(), houseSource.getType());
		
		if(houseSourcePO == null){
			throw new FLException(320005, "房源不存在");
		}
		
		HouseSourceVO houseSourceVO = houseSourcePOToVO(houseSourcePO);
		
		return houseSourceVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addHouseSource(HouseSourceVO houseSourceVO, String userId) throws FLException {
		
		Integer houseCount = houseSourceDao.countHouseSource(houseSourceVO.getHouse().getHid(), houseSourceVO.getType());
		
		if(houseCount > 0){
			throw new FLException(320004, "房源已存在");
		}
		
		UserPO createPO = userDao.queryUserByUserId(userId);
		UserPO followPO = userDao.queryUserByUserId(houseSourceVO.getFollowUser().getUserId());
		HousePO housePO = houseDao.get(houseSourceVO.getHouse().getHid());
		CustomerPO customerPO = customerDao.get(houseSourceVO.getCustomer().getCid());
		
		HouseSourcePO houseSourcePO = new HouseSourcePO(housePO, customerPO, createPO, followPO);
		BeanUtil.copyProperties(houseSourceVO, houseSourcePO, Arrays.asList("house", "customer", "create", "followUser"));
		
		houseSourcePO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		houseSourcePO.setStatus(HouseSourcePO.STATUS_INIT_SHORT);
		//NO
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate);
		
		String no = "H" + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		houseSourcePO.setNo(no);
		
		houseSourceDao.save(houseSourcePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateHouseSource(HouseSourceVO houseSourceVO) throws FLException {
		
		HouseSourcePO houseSourcePO = houseSourceDao.get(houseSourceVO.getHsid());
		
		if(houseSourcePO == null){
			throw new FLException(320005, "房源不存在");
		}
		
		if(houseSourcePO.getStatus() == 2){
			throw new FLException(320006, "房源状态不可操作");
		}
		
		BeanUtil.copyProperties(houseSourceVO, houseSourcePO, Arrays.asList("house", "customer", "create", "followUser"));
		
		houseSourceDao.update(houseSourcePO);

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateHouseSourceForBelong(HouseSourceVO houseSourceVO) throws FLException {
		
		HouseSourcePO houseSourcePO = houseSourceDao.get(houseSourceVO.getHsid());
		
		if(houseSourcePO == null){
			throw new FLException(320005, "房源不存在");
		}
		
		if(houseSourcePO.getStatus() == 2){
			throw new FLException(320006, "房源状态不可操作");
		}
		
		UserPO followUserPO = userDao.queryUserByUserId(houseSourceVO.getFollowUser().getUserId());
		
		houseSourcePO.setFollowUser(followUserPO);
		
		houseSourceDao.update(houseSourcePO);

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateHouseSourceForStatus(HouseSourceVO houseSourceVO) throws FLException {
		
		HouseSourcePO houseSourcePO = houseSourceDao.get(houseSourceVO.getHsid());
		
		if(houseSourcePO == null){
			throw new FLException(320005, "房源不存在");
		}
		
		if(houseSourcePO.getStatus() == 2){
			throw new FLException(320006, "房源状态不可操作");
		}
		
		if(houseSourceVO.getStatus() == 0){
			BuildingPO buildingPO = buildingDao.queryBuildingByHsid(houseSourceVO.getHsid());
			
			if(buildingPO != null){
				throw new FLException(320006, "房源状态不可操作");
			}
		}
		
		houseSourcePO.setStatus(houseSourceVO.getStatus());
		
		houseSourceDao.update(houseSourcePO);

	}
	
	public HouseSourceVO houseSourcePOToVO(HouseSourcePO houseSourcePO){
		
		VillageVO villageVO = new VillageVO(new CityProperVO());
		HouseSourceVO houseSourceVO = new HouseSourceVO(new HouseVO(villageVO), new CustomerVO(), new UserVO(), new UserVO());
		BeanUtil.copyProperties(houseSourcePO, houseSourceVO, Arrays.asList("house", "customer", "create", "followUser"));
		BeanUtil.copyProperties(houseSourcePO.getHouse(), houseSourceVO.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(houseSourcePO.getHouse().getVillage(), houseSourceVO.getHouse().getVillage(), Arrays.asList("cityProper"));
		BeanUtil.copyProperties(houseSourcePO.getHouse().getVillage().getCityProper(), houseSourceVO.getHouse().getVillage().getCityProper(), Arrays.asList("city"));
		BeanUtil.copyProperties(houseSourcePO.getCustomer(), houseSourceVO.getCustomer());
		BeanUtil.copyProperties(houseSourcePO.getCreate(), houseSourceVO.getCreate(), Arrays.asList("role", "dept", "duty"));
		BeanUtil.copyProperties(houseSourcePO.getFollowUser(), houseSourceVO.getFollowUser(), Arrays.asList("role", "dept", "duty"));
		
		//customer
		BeanUtil.copyProperties(houseSourcePO.getCustomer(), houseSourceVO.getCustomer());
		List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhoneByCid(houseSourcePO.getCustomer().getCid(), CustomerSourcePO.STATUS_INIT_SHORT);
		
		if(customerPhones.size() > 0){
			houseSourceVO.getCustomer().setPhone(customerPhones.get(0).getPhone());
		}
		
		BeanUtil.copyProperties(houseSourcePO.getCreate(), houseSourceVO.getCreate(), Arrays.asList("role", "dept", "duty"));
		BeanUtil.copyProperties(houseSourcePO.getFollowUser(), houseSourceVO.getFollowUser(), Arrays.asList("role", "dept", "duty"));
		
		return houseSourceVO;
	}

}
