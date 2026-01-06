/**
 * Title: CityProperServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.VillageDao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.CityDao;
import com.fanglin.system.dao.CityProperDao;
import com.fanglin.system.po.CityPO;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.system.service.CityProperService;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;
import com.fanglin.utils.SystemConfig;

@Service("cityProperService")
@Transactional(readOnly = true)
public class CityProperServiceImpl implements CityProperService {

	@Autowired
	private CityProperDao cityProperDao;

	@Autowired
	private CityDao cityDao;

	@Autowired
	private VillageDao villageDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageCityProper(Paging paging, List<Filter> filters) {

		List<CityProperPO> cityProperPOs = cityProperDao.pageCityProper(paging, filters);
		List<CityProperVO> cityProperVOs = new ArrayList<CityProperVO>();

		for (CityProperPO cityProperPO : cityProperPOs) {
			cityProperVOs.add(cityProperPO.ptv(new CityProperVO(new CityVO(new RegionVO()))));
		}

		paging.setData(cityProperVOs);
	}

	@Override
	public List<CityProperVO> queryCityProper() {

		List<CityProperPO> cityProperPOs = cityProperDao.list();
		List<CityProperVO> cityProperVOs = new ArrayList<CityProperVO>();

		for (CityProperPO cityProperPO : cityProperPOs) {
			cityProperVOs.add(cityProperPO.ptv(new CityProperVO(new CityVO(new RegionVO()))));
		}

		return cityProperVOs;
	}

	@Override
	public CityProperVO queryCityProperByCpid(CityProperVO cityProperVO) {

		CityProperPO cityProperPO = cityProperDao.get(cityProperVO.getCpid());

		if (cityProperPO != null) {
			cityProperVO = cityProperPO.ptv(new CityProperVO(new CityVO(new RegionVO())));
		}

		return cityProperVO;
	}

	@Override
	public List<CityProperVO> queryCityProperByCid(CityProperVO cityProperVO) {

		List<CityProperPO> cityProperPOs = cityProperDao.queryCityProper(cityProperVO.getCity().getCid());
		List<CityProperVO> cityProperVOs = new ArrayList<CityProperVO>();

		for (CityProperPO cityProperPO : cityProperPOs) {
			cityProperVOs.add(cityProperPO.ptv(new CityProperVO(new CityVO(new RegionVO()))));
		}

		return cityProperVOs;
	}

	@Override
	public List<CityProperVO> queryCityProperByName(CityProperVO cityProperVO) {

		List<CityProperPO> cityProperPOs = cityProperDao.pageCityProper(new Paging(0, 50), cityProperVO.getName());
		List<CityProperVO> cityProperVOs = new ArrayList<CityProperVO>();

		for (CityProperPO cityProperPO : cityProperPOs) {
			cityProperVOs.add(cityProperPO.ptv(new CityProperVO(new CityVO(new RegionVO()))));
		}

		return cityProperVOs;
	}

	@Override
	@Transactional
	public CityProperVO existCity(CityProperVO cityProperVO) throws FLException {

		if (cityProperVO == null || cityProperVO.getName() == null) return cityProperVO;

		CityProperPO cityProper = cityProperDao.queryCityProper(cityProperVO.getName().trim());

		if (cityProper == null) {
			addCityProper(cityProperVO);
		}

		return cityProper.ptv(new CityProperVO(new CityVO(new RegionVO())));
	}

	@Override
	@Transactional
	public void addCityProper(CityProperVO cityProperVO) throws FLException {

		if (cityProperVO.getCity() == null) {
			throw new FLException(230019, "城市不存在");
		}

		CityPO cityPO = cityDao.get(cityProperVO.getCity().getCid());

		if (cityPO == null) {
			throw new FLException(230019, "城市不存在");
		}

		CityProperPO cityProperPO = new CityProperPO();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CITY_PROPER_INT, CountingPO.COUNTING_DATE_SILNLE_STR, 0);

		StringBuffer no = new StringBuffer();
		no.append(SystemConfig.getString("regionIdent", "R_"));
		no.append(FormatUtil.fillZero(count, "000"));

		cityProperPO.setNo(no.toString());

		BeanUtil.copyProperties(cityProperVO, cityProperPO, Arrays.asList("no", "city"));

		cityProperPO.setCity(cityPO);

		cityProperPO.setPinyin((String) PinYin4Util.getPinyin(cityProperVO.getName()).get(0));

		cityProperDao.save(cityProperPO);
	}

	@Override
	@Transactional
	public void updateCityProper(CityProperVO cityProperVO) throws FLException {

		CityProperPO cityProperPO = cityProperDao.get(cityProperVO.getCpid());

		if (cityProperPO == null) {
			throw new FLException(230018, "城区不存在");
		}

		if (cityProperVO.getCity() == null) {
			throw new FLException(230019, "城市不存在");
		}

		CityPO cityPO = cityDao.get(cityProperVO.getCity().getCid());

		if (cityPO == null) {
			throw new FLException(230019, "城市不存在");
		}

		BeanUtil.copyProperties(cityProperVO, cityProperPO, Arrays.asList("no", "city"));

		cityProperPO.setCity(cityPO);

		cityProperPO.setPinyin((String) PinYin4Util.getPinyin(cityProperVO.getName()).get(0));

		cityProperDao.update(cityProperPO);
	}

	@Override
	@Transactional
	public int updateCityProperForPosition(CityProperVO cityProperVO) throws FLException {

		CityProperPO cityProperPO = cityProperDao.get(cityProperVO.getCpid());

		if (cityProperPO == null) {
			throw new FLException(230018, "城区不存在");
		}

		cityProperPO.setX(cityProperVO.getX());
		cityProperPO.setY(cityProperVO.getY());

		cityProperDao.update(cityProperPO);

		return 0;
	}

	@Override
	@Transactional
	public String deleteCityProper(List<Integer> cpids) {

		String quotedCityProper = "";

		for (Integer cpid : cpids) {
			int count = villageDao.countVillageByCpid(cpid);

			if (count != 0) {
				quotedCityProper += cpid + ",";
			}
		}

		if (quotedCityProper.equals("")) {
			for (Integer cpid : cpids) {
				deleteCityProperByCpid(cpid);
			}
		} else {
			quotedCityProper = quotedCityProper.substring(0, quotedCityProper.length() - 1);
		}

		return quotedCityProper;
	}

	@Override
	@Transactional
	public void deleteCityProperByCpid(Integer cpid) {
		cityProperDao.deleteById(cpid);
	}

}
