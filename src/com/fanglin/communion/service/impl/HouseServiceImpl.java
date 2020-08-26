package com.fanglin.communion.service.impl;

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
import com.fanglin.communion.service.HouseService;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("houseService")
@Transactional(readOnly = true)
public class HouseServiceImpl implements HouseService {

	@Autowired
	private HouseDao houseDao;

	@Autowired
	private VillageDao villageDao;

	@Override
	public void pageHouse(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<HousePO> housePOs = houseDao.pageHouse(paging, filters, company);
		List<HouseVO> houseVOs = new ArrayList<HouseVO>();

		for (HousePO housePO : housePOs) {
			houseVOs.add(convertBean(housePO));
		}

		paging.setData(houseVOs);
	}

	@Override
	public HouseVO queryHouseByHid(HouseVO houseVO) throws FLException {

		HousePO housePO = houseDao.get(houseVO.getHid());

		if (housePO == null) {
			throw new FLException(320002, "房产不存在");
		}

		houseVO = convertBean(housePO);

		return houseVO;
	}

	@Override
	public HouseVO queryHouseByNoAHnum(HouseVO houseVO, Integer company) throws FLException {

		HousePO housePO = houseDao.queryHouseByNoAHnum(houseVO.getVillage().getNo(), houseVO.getHouseNumber(), company);

		if (housePO == null) {
			throw new FLException(320002, "房产不存在");
		}

		houseVO = convertBean(housePO);

		return houseVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addHouse(HouseVO houseVO, Integer company) throws FLException {

		HousePO housePO = houseDao.queryHouseByNoAHnum(houseVO.getVillage().getNo(), houseVO.getHouseNumber(), company);

		if (housePO != null) {
			throw new FLException(320001, "楼牌号已存在");
		}

		housePO = new HousePO();

		BeanUtil.copyProperties(houseVO, housePO, Arrays.asList("village"));

		VillagePO villagePO = villageDao.get(houseVO.getVillage().getNo());

		housePO.setVillage(villagePO);
		housePO.setCompany(company);
		
		houseDao.save(housePO);

		BeanUtil.copyProperties(housePO, houseVO, Arrays.asList("village"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int existHouse(HouseVO houseVO, Integer company) {

		HousePO housePO = houseDao.queryHouseByNoAHnum(houseVO.getVillage().getNo(), houseVO.getHouseNumber(), company);

		if (housePO == null) {
			housePO = new HousePO();

			BeanUtil.copyProperties(houseVO, housePO, Arrays.asList("village"));

			VillagePO villagePO = villageDao.get(houseVO.getVillage().getNo());

			housePO.setVillage(villagePO);
			housePO.setCompany(company);

			houseDao.save(housePO);

			BeanUtil.copyProperties(housePO, houseVO, Arrays.asList("village"));
		}

		houseVO.setHid(housePO.getHid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateHouse(HouseVO houseVO) throws FLException {

		HousePO housePO = houseDao.get(houseVO.getHid());

		if (housePO == null) {
			throw new FLException(320002, "房产不存在");
		}

		BeanUtil.copyProperties(houseVO, housePO, Arrays.asList("village", "hid", "company", "no", "houseNumber", "built", "unit", "floor", "door"));
		
		houseDao.update(housePO);

		BeanUtil.copyProperties(housePO, houseVO, Arrays.asList("village"));

		return 0;
	}

	private HouseVO convertBean(HousePO housePO) throws FLException {

		HouseVO houseVO = new HouseVO(new VillageVO());

		BeanUtil.copyProperties(housePO, houseVO, Arrays.asList("village"));

		BeanUtil.copyProperties(housePO.getVillage(), houseVO.getVillage(), Arrays.asList("cityProper"));

		houseVO.getVillage().setCityProper(new CityProperVO());
		BeanUtil.copyProperties(housePO.getVillage().getCityProper(), houseVO.getVillage().getCityProper(), Arrays.asList("city"));

		houseVO.getVillage().getCityProper().setCity(new CityVO());
		BeanUtil.copyProperties(housePO.getVillage().getCityProper().getCity(), houseVO.getVillage().getCityProper().getCity(), Arrays.asList("region"));

		houseVO.getVillage().getCityProper().getCity().setRegion(new RegionVO());
		BeanUtil.copyProperties(housePO.getVillage().getCityProper().getCity().getRegion(), houseVO.getVillage().getCityProper().getCity().getRegion());

		return houseVO;
	}

}
