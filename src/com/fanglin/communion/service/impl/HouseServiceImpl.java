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
import com.fanglin.core.security.SensitiveDataHelper;
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
			houseVOs.add(housePO.ptv(new HouseVO(new VillageVO(new CityProperVO(new CityVO(new RegionVO()))))));
		}

		paging.setData(houseVOs);
	}

	@Override
	public HouseVO queryHouseByHid(HouseVO houseVO) throws FLException {

		HousePO housePO = houseDao.get(houseVO.getHid());

		if (housePO == null) {
			throw new FLException(320002, "房产不存在");
		}

		return housePO.ptv(new HouseVO(new VillageVO(new CityProperVO(new CityVO(new RegionVO())))));
	}

	@Override
	public HouseVO queryHouseByNoAHnum(HouseVO houseVO, Integer company) throws FLException {

		HousePO housePO = houseDao.queryHouseByNoAHnum(houseVO.getVillage().getNo(), houseVO.getHouseNumber(), company);
		if (housePO == null) {
			housePO = houseDao.queryHouseByNoAHnum(houseVO.getVillage().getNo(), SensitiveDataHelper.encrypt(houseVO.getHouseNumber()), company);
		}

		if (housePO == null) {
			throw new FLException(320002, "房产不存在");
		}

		return housePO.ptv(new HouseVO(new VillageVO(new CityProperVO(new CityVO(new RegionVO())))));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addHouse(HouseVO houseVO, Integer company) throws FLException {

		HousePO housePO = houseDao.queryHouseByNoAHnum(houseVO.getVillage().getNo(), SensitiveDataHelper.encrypt(houseVO.getHouseNumber()), company);
		if (housePO == null) {
			housePO = houseDao.queryHouseByNoAHnum(houseVO.getVillage().getNo(), houseVO.getHouseNumber(), company);
		}

		if (housePO != null) {
			throw new FLException(320001, "楼牌号已存在");
		}

		housePO = new HousePO();
		BeanUtil.copyProperties(houseVO, housePO, Arrays.asList("village", "houseNumber"));
		housePO.setHouseNumber(SensitiveDataHelper.encrypt(houseVO.getHouseNumber()));

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

		HousePO housePO = houseDao.queryHouseByNoAHnum(houseVO.getVillage().getNo(), SensitiveDataHelper.encrypt(houseVO.getHouseNumber()), company);
		if (housePO == null) {
			housePO = houseDao.queryHouseByNoAHnum(houseVO.getVillage().getNo(), houseVO.getHouseNumber(), company);
		}

		if (housePO == null) {
			housePO = new HousePO();
			BeanUtil.copyProperties(houseVO, housePO, Arrays.asList("village", "houseNumber"));
			housePO.setHouseNumber(SensitiveDataHelper.encrypt(houseVO.getHouseNumber()));

			VillagePO villagePO = villageDao.get(houseVO.getVillage().getNo());
			housePO.setVillage(villagePO);
			housePO.setCompany(company);
			housePO.setInnerArea(0);
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

}
