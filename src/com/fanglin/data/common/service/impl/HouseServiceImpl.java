package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.HouseDao;
import com.fanglin.data.common.dao.VillageDao;
import com.fanglin.data.common.service.HouseService;
import com.fanglin.data.common.vo.HouseVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.data.po.HousePO;
import com.fanglin.data.po.VillagePO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("houseService")
@Transactional(readOnly=true)
public class HouseServiceImpl implements HouseService {
	
	@Autowired
	private HouseDao houseDao;
	
	@Autowired
	private VillageDao villageDao;
	
	@Override
	public void pageHouse(Paging paging, List<Filter> filters) throws FLException{
		
		List<HousePO> housePOs = houseDao.pageHouse(paging, filters);
		List<HouseVO> houseVOs = new ArrayList<HouseVO>();
		
		HouseVO houseVO;
		
		for (HousePO housePO : housePOs) {
			houseVO= new HouseVO(new VillageVO());
			
			houseVO = convertBean(housePO);
			
			houseVOs.add(houseVO);
		}
		
		paging.setData(houseVOs);

	}

	@Override
	public HouseVO queryHouseByHid(HouseVO houseVO) throws FLException {
		
		HousePO housePO=houseDao.get(houseVO.getHid());
		
		if(housePO==null){
			throw new FLException(320002, "房产不存在");
		}
		
		houseVO = convertBean(housePO);
		
		return houseVO;
	}

	@Override
	public HouseVO queryHouseByNoAHnum(HouseVO houseVO)throws FLException {
		
		HousePO housePO = houseDao.queryHouseByNoAHnum(houseVO.getVillage().getNo(),houseVO.getHouseNumber(),houseVO.getStatus());
		
		if(housePO==null){
			throw new FLException(320002, "房产不存在");
		}
		
		houseVO = convertBean(housePO);
		
		return houseVO;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addHouse(HouseVO houseVO) throws FLException{
		
		HousePO housePO = houseDao.queryHouseByNoAHnum(houseVO.getVillage().getNo(),houseVO.getHouseNumber(),null);
		
		if(housePO != null){
			throw new FLException(320001, "楼牌号已存在");
		}
		
		housePO=new HousePO();
		
		BeanUtil.copyProperties(houseVO, housePO, Arrays.asList("village"));
		
		VillagePO villagePO =villageDao.get(houseVO.getVillage().getNo());
		
		housePO.setVillage(villagePO);
		
		houseDao.save(housePO);
		
		BeanUtil.copyProperties(housePO, houseVO, Arrays.asList("village"));
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateHouse(HouseVO houseVO) throws FLException{
		
		HousePO housePO = houseDao.get(houseVO.getHid());
		
		if(housePO == null){
			throw new FLException(320002, "房产不存在");
		}
		
		BeanUtil.copyProperties(houseVO, housePO, Arrays.asList("village","hid"));
		
		houseDao.update(housePO);
		
		BeanUtil.copyProperties(housePO, houseVO, Arrays.asList("village"));
		
	}

	private HouseVO convertBean(HousePO housePO) throws FLException{
		
		HouseVO houseVO = new HouseVO(new VillageVO());
		
		BeanUtil.copyProperties(housePO, houseVO, Arrays.asList("village"));
		
		BeanUtil.copyProperties(housePO.getVillage(), houseVO.getVillage(),Arrays.asList("cityProper"));

		houseVO.getVillage().setCityProper(new CityProperVO());
		BeanUtil.copyProperties(housePO.getVillage().getCityProper(), houseVO.getVillage().getCityProper(), Arrays.asList("city"));
		
		houseVO.getVillage().getCityProper().setCity(new CityVO());
		BeanUtil.copyProperties(housePO.getVillage().getCityProper().getCity(), houseVO.getVillage().getCityProper().getCity(), Arrays.asList("region"));
		
		houseVO.getVillage().getCityProper().getCity().setRegion(new RegionVO());
		BeanUtil.copyProperties(housePO.getVillage().getCityProper().getCity().getRegion(), houseVO.getVillage().getCityProper().getCity().getRegion());

		return houseVO;
	}

}
