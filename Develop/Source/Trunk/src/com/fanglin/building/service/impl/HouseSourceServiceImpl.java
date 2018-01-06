package com.fanglin.building.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.building.dao.BuildingDrawingDao;
import com.fanglin.building.dao.HouseSourceDao;
import com.fanglin.building.po.BuildingDrawingPO;
import com.fanglin.building.po.CustomerSourcePO;
import com.fanglin.building.po.HouseSourcePO;
import com.fanglin.building.service.HouseSourceService;
import com.fanglin.building.vo.HouseSourceVO;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.CustomerDao;
import com.fanglin.data.common.dao.CustomerPhoneDao;
import com.fanglin.data.common.dao.HouseDao;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.HouseVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.data.po.CustomerPhonePO;
import com.fanglin.data.po.HousePO;
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
	private BuildingDrawingDao buildingDrawingDao;
	
	@Override
	public void pageHouseSource(Paging paging, List<Filter> filters) {
		
		List<HouseSourcePO> houseSourcePOs = houseSourceDao.pageHouseSource(paging, filters);
		List<HouseSourceVO> houseSourceVOs = new ArrayList<HouseSourceVO>();
		
		for (HouseSourcePO houseSourcePO : houseSourcePOs) {
			HouseSourceVO houseSourceVO = houseSourcePOToVO(houseSourcePO);
			List<BuildingDrawingPO> buildingDrawings = buildingDrawingDao.queryBuildingDrawing(houseSourceVO.getHsid(), BuildingDrawingPO.TYPE_HSDRAWING_INT);
			houseSourceVO.setDrawingNum(buildingDrawings.size());
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
	public HouseSourceVO queryHouseSourceForNo(HouseSourceVO houseSource) throws FLException {
		
		HouseSourcePO houseSourcePO = houseSourceDao.queryHouseSourceForNo(houseSource.getNo());
		
		if(houseSourcePO == null){
			throw new FLException(320005, "房源不存在");
		}
		
		HouseSourceVO houseSourceVO = houseSourcePOToVO(houseSourcePO);
		
		return houseSourceVO;
	}
	
	@Override
	public HouseSourceVO checkHouseSourceByHidAndType(HouseSourceVO houseSource) throws FLException {
		
		HouseSourcePO houseSourcePO = houseSourceDao.checkHouseSourceByHidAndType(houseSource.getHouse().getHid(), houseSource.getType());
		
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
