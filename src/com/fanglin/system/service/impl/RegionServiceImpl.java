/**
 * @FileName	: RegionServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date		: 2014-7-28
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
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
import com.fanglin.system.dao.RegionDao;
import com.fanglin.system.po.CityPO;
import com.fanglin.system.po.RegionPO;
import com.fanglin.system.service.RegionService;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;
import com.fanglin.utils.SystemConfig;

@Service("regionSercie")
@Transactional(readOnly = true)
public class RegionServiceImpl implements RegionService {

	@Autowired
	private RegionDao regionDao;

	@Autowired
	private CityDao cityDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageRegion(Paging paging, List<Filter> filters) {

		List<RegionPO> regionPOs = regionDao.pageRegion(paging, filters);
		List<RegionVO> regionVOs = new ArrayList<RegionVO>();

		for (RegionPO regionPO : regionPOs) {
			RegionVO regionVO = new RegionVO();
			BeanUtil.copyProperties(regionPO, regionVO);

			regionVOs.add(regionVO);
		}

		paging.setData(regionVOs);
	}

	@Override
	public List<RegionVO> queryRegion() {

		List<RegionPO> regionPOs = regionDao.queryRegion();
		List<RegionVO> regionVOs = new ArrayList<RegionVO>();

		for (RegionPO regionPO : regionPOs) {
			RegionVO regionVO = new RegionVO();
			BeanUtil.copyProperties(regionPO, regionVO);

			regionVOs.add(regionVO);
		}

		return regionVOs;
	}

	@Override
	public RegionVO queryRegionByRid(RegionVO regionVO) {

		RegionPO regionPO = regionDao.get(regionVO.getRid());

		if (regionPO != null) {
			regionVO = new RegionVO();
			BeanUtil.copyProperties(regionPO, regionVO);
		}

		return regionVO;
	}

	@Override
	public List<RegionVO> queryRegionByName(RegionVO regionVO) {

		List<RegionPO> regionPOs = regionDao.pageRegionByName(new Paging(0, 50), regionVO.getName());
		List<RegionVO> regionVOs = new ArrayList<RegionVO>();

		for (RegionPO regionPO : regionPOs) {
			regionVO = new RegionVO();
			BeanUtil.copyProperties(regionPO, regionVO);

			regionVOs.add(regionVO);
		}

		return regionVOs;
	}

	@Override
	@Transactional
	public RegionVO existRegion(RegionVO regionVO) {

		RegionPO regionPO = regionDao.queryRegion(regionVO.getName());

		// 如果不存在则创建
		if (regionPO == null) {

			addRegion(regionVO);
		}

		// 转换为VO并返回
		BeanUtil.copyProperties(regionPO, regionVO);

		return regionVO;
	}

	@Override
	@Transactional
	public void addRegion(RegionVO regionVO) {

		RegionPO regionPO = new RegionPO();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_REGION_INT, CountingPO.COUNTING_DATE_SILNLE_STR, 0);

		StringBuffer no = new StringBuffer();
		no.append(SystemConfig.getString("regionIdent", "A_"));
		no.append(FormatUtil.fillZero(count, "00"));

		regionPO.setNo(no.toString());

		BeanUtil.copyProperties(regionVO, regionPO, Arrays.asList("no", "x", "y"));

		regionPO.setPinyin((String) PinYin4Util.getPinyin(regionVO.getName()).get(0));

		regionDao.save(regionPO);
	}

	@Override
	@Transactional
	public void updateRegion(RegionVO regionVO) throws FLException {

		RegionPO regionPO = regionDao.get(regionVO.getRid());

		if (regionPO == null) {
			throw new FLException(230020, "大区不存在");
		}

		BeanUtil.copyProperties(regionVO, regionPO, Arrays.asList("rid", "no"));

		regionPO.setPinyin((String) PinYin4Util.getPinyin(regionVO.getName()).get(0));

		regionDao.update(regionPO);
	}

	@Override
	@Transactional
	public String deleteRegion(List<Integer> rids) {

		String quotedRegion = "";

		for (Integer rid : rids) {
			List<CityPO> cityPOs = cityDao.queryCity(rid);

			if (cityPOs.size() != 0) quotedRegion += rid + ",";
		}

		if (quotedRegion.equals("")) {
			for (Integer rid : rids)
				deleteRegionByRid(rid);
		} else {
			quotedRegion = quotedRegion.substring(0, quotedRegion.length() - 1);
		}

		return quotedRegion;
	}

	@Override
	@Transactional
	public void deleteRegionByRid(Integer rid) {

		regionDao.deleteById(rid);
	}

}
