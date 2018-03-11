/**
 * Title: CityServiceImpl
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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.CityDao;
import com.fanglin.system.dao.CityProperDao;
import com.fanglin.system.po.CityPO;
import com.fanglin.system.po.RegionPO;
import com.fanglin.system.service.CityService;
import com.fanglin.system.vo.CityVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;
import com.fanglin.utils.SystemConfig;

@Service("cityService")
@Transactional(readOnly = true)
public class CityServiceImpl implements CityService {

	@Autowired
	private CityDao cityDao;

	@Autowired
	private CountingService countingService;
	
	@Autowired
	private CityProperDao cityProper;

	@Override
	public void pageCity(Paging paging, List<Filter> filters) {

		List<CityPO> cityPOs = cityDao.pageCity(paging, filters);
		List<CityVO> cityVOs = new ArrayList<CityVO>();

		for (CityPO cityPO : cityPOs) {
			CityVO cityVO = new CityVO();
			BeanUtil.copyProperties(cityPO, cityVO, Arrays.asList("region"));

			cityVO.setRegion(new RegionVO());
			BeanUtil.copyProperties(cityPO.getRegion(), cityVO.getRegion());

			cityVOs.add(cityVO);
		}

		paging.setData(cityVOs);
	}

	@Override
	public List<CityVO> queryCity() {

		List<CityPO> cityPOs = cityDao.list();
		List<CityVO> cityVOs = new ArrayList<CityVO>();

		for (CityPO cityPO : cityPOs) {
			CityVO cityVO = new CityVO();

			BeanUtil.copyProperties(cityPO, cityVO, Arrays.asList("region"));

			cityVO.setRegion(new RegionVO());
			BeanUtil.copyProperties(cityPO.getRegion(), cityVO.getRegion());

			cityVOs.add(cityVO);
		}

		return cityVOs;
	}

	@Override
	public CityVO queryCityByCid(CityVO cityVO) throws FLException {

		CityPO cityPO = cityDao.get(cityVO.getCid());

		if (cityPO == null) {
			throw new FLException(230019, "城市不存在");
		}

		BeanUtil.copyProperties(cityPO, cityVO, Arrays.asList("region"));

		cityVO.setRegion(new RegionVO());
		BeanUtil.copyProperties(cityPO.getRegion(), cityVO.getRegion());

		return cityVO;
	}

	public List<CityVO> queryCityByRid(CityVO cityVO) {

		List<CityPO> cityPOs = cityDao.queryCityByRid(cityVO.getRegion().getRid());
		List<CityVO> cityVOs = new ArrayList<CityVO>();

		for (CityPO cityPO : cityPOs) {
			cityVO = new CityVO();

			BeanUtil.copyProperties(cityPO, cityVO, Arrays.asList("region"));

			cityVO.setRegion(new RegionVO());
			BeanUtil.copyProperties(cityPO.getRegion(), cityVO.getRegion());

			cityVOs.add(cityVO);
		}

		return cityVOs;
	}

	@Override
	public List<CityVO> queryCityByName(CityVO cityVO) {

		List<CityPO> cityPOs = cityDao.pageCityByName(new Paging(0, 50), cityVO.getName());
		List<CityVO> cityVOs = new ArrayList<CityVO>();

		for (CityPO cityPO : cityPOs) {
			cityVO = new CityVO();
			BeanUtil.copyProperties(cityPO, cityVO, Arrays.asList("region"));

			cityVO.setRegion(new RegionVO());
			BeanUtil.copyProperties(cityPO.getRegion(), cityVO.getRegion());

			cityVOs.add(cityVO);
		}

		return cityVOs;
	}

	@Override
	@Transactional
	public void addCity(CityVO cityVO) {

		CityPO cityPO = new CityPO();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CITY_INT, CountingPO.COUNTING_DATE_SILNLE_STR);

		StringBuffer no = new StringBuffer();
		no.append(SystemConfig.getString("companyIdent", ""));
		no.append(SystemConfig.getString("cityIdent", "C_"));
		no.append(FormatUtil.fillZero(count, "00"));

		cityPO.setNo(no.toString());
		cityPO.setName(cityVO.getName());

		cityPO.setRegion(new RegionPO(cityVO.getRegion().getRid()));
		BeanUtil.copyProperties(cityVO.getRegion(), cityPO.getRegion());

		cityPO.setPinyin((String)PinYin4Util.getPinyin(cityVO.getName()).get(0));
		
		cityDao.save(cityPO);
	}

	@Override
	@Transactional
	public void updateCity(CityVO cityVO) throws FLException {

		CityPO cityPO = cityDao.get(cityVO.getCid());
		
		if (cityPO == null) {
			throw new FLException(230019, "城市不存在");
		}

		BeanUtil.copyProperties(cityVO, cityPO, Arrays.asList("no", "region"));

		cityPO.setRegion(new RegionPO(cityVO.getRegion().getRid()));
		BeanUtil.copyProperties(cityVO.getRegion(), cityPO.getRegion());

		cityPO.setPinyin((String)PinYin4Util.getPinyin(cityVO.getName()).get(0));

		cityDao.update(cityPO);
	}

	@Override
	@Transactional
	public int deleteCityByCids(List<Integer> cids) throws FLException {
		
		for(int cid: cids){
			
			CityPO cityPO = cityDao.get(cid);
			
			if(cityPO != null){

				int count = cityProper.countCityProperByCid(cid);
				
				if(count > 0){
					throw new FLException(230006, String.format("城市[%s]已被引用, 不能被删除", cid));
				}
				
				cityDao.delete(cityPO);
			}
		}

		return 0;
	}

}
