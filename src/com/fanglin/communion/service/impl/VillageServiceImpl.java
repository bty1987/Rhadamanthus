package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.VillageDao;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.communion.service.VillageService;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("villageService")
@Transactional(readOnly = true)
public class VillageServiceImpl implements VillageService {
	
	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private VillageDao villageDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageVillage(Paging paging, List<Filter> filters, Integer company) {

		List<VillagePO> villagePOs = villageDao.pageVillage(paging, filters, company);

		List<VillageVO> villageVOs = new ArrayList<VillageVO>();

		for (VillagePO villagePO : villagePOs) {
			villageVOs.add(covertBean(villagePO));
		}

		paging.setData(villageVOs);
	}

	@Override
	public VillageVO queryVillageById(VillageVO villageVO) throws FLException {

		VillagePO villagePO = villageDao.get(villageVO.getNo());

		if (villagePO == null) {
			throw new FLException(130003, "楼盘信息不存在");
		}

		villageVO = covertBean(villagePO);

		return villageVO;
	}

	@Override
	public List<VillageVO> queryVillageForNameByPinyin(String pinyinName, Integer company) {

		Paging paging = new Paging(0, 20);

		List<VillageVO> villageVOs = new ArrayList<VillageVO>();

		List<VillagePO> villagePOs = villageDao.queryVillageByPinyin(paging, pinyinName, company);

		for (VillagePO villagePO : villagePOs) {
			villageVOs.add(covertBean(villagePO));
		}

		return villageVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addVillage(VillageVO villageVO, Integer company) throws FLException {
		
		CompanyPO companyPO = companyDao.get(company);
		
		if(companyPO == null){
			throw new FLException(230015, "公司不存在");
		}

		VillagePO villagePO = new VillagePO();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_VILLAGE_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

		StringBuffer no = new StringBuffer();
		no.append(String.format("%sP-", companyPO.getShortname()));
		no.append(FormatUtil.fillZero(count, "00000"));

		villagePO.setNo(no.toString());

		BeanUtil.copyProperties(villageVO, villagePO, Arrays.asList("no", "cityProper"));

		villagePO.setCityProper(new CityProperPO(villageVO.getCityProper().getCpid()));
		villagePO.setPinyinAB((String) PinYin4Util.getPinYinHeadChar(villageVO.getName()).get(0));
		villagePO.setPinyinAll((String) PinYin4Util.getPinyin(villageVO.getName()).get(0));
		villagePO.setCompany(company);

		villageDao.save(villagePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateVillage(VillageVO villageVO, Integer company) throws FLException {

		VillagePO villagePO = villageDao.get(villageVO.getNo());

		if (villagePO == null) {
			throw new FLException(130003, "楼盘信息不存在");
		}

		if (!(villagePO.getName()).equals(villageVO.getName()) || ((villagePO.getCityProper().getCpid()) != (villageVO.getCityProper().getCpid()))) {

			if (villageDao.countVillageByNameACpid(villageVO.getName(), villageVO.getCityProper().getCpid(), company) > 0) {
				throw new FLException(130020, "楼盘已存在");
			}
		}

		villageVO.setVid(villagePO.getVid());

		BeanUtil.copyProperties(villageVO, villagePO, Arrays.asList("no", "x", "y", "cityProper", "company"));

		villagePO.setCityProper(new CityProperPO(villageVO.getCityProper().getCpid()));
		villagePO.setPinyinAB((String) PinYin4Util.getPinYinHeadChar(villageVO.getName()).get(0));
		villagePO.setPinyinAll((String) PinYin4Util.getPinyin(villageVO.getName()).get(0));

		villageDao.update(villagePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateVillageForStatus(VillageVO villageVO) throws FLException {

		VillagePO villagePO = villageDao.get(villageVO.getNo());

		if (villagePO == null) {
			throw new FLException(130003, "楼盘信息不存在");
		}

		villagePO.setStatus(villageVO.getStatus());

		villageDao.update(villagePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateVillageForPosition(VillageVO villageVO) throws FLException {

		VillagePO villagePO = villageDao.get(villageVO.getNo());

		if (villagePO == null) {
			throw new FLException(130003, "楼盘信息不存在");
		}

		villagePO.setX(villageVO.getX());
		villagePO.setY(villageVO.getY());

		villageDao.update(villagePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateVillageForUrl(VillageVO villageVO) throws FLException {

		VillagePO villagePO = villageDao.get(villageVO.getNo());

		villagePO.setUrl(villageVO.getUrl());

		villageDao.update(villagePO);

		return 0;
	}

	public VillageVO covertBean(VillagePO villagePO) {
		VillageVO villageVO = new VillageVO();

		BeanUtil.copyProperties(villagePO, villageVO, Arrays.asList("cityProper"));

		villageVO.setCityProper(new CityProperVO());

		BeanUtil.copyProperties(villagePO.getCityProper(), villageVO.getCityProper(), Arrays.asList("city"));

		villageVO.getCityProper().setCity(new CityVO());
		BeanUtil.copyProperties(villagePO.getCityProper().getCity(), villageVO.getCityProper().getCity(), Arrays.asList("region"));

		villageVO.getCityProper().getCity().setRegion(new RegionVO());
		BeanUtil.copyProperties(villagePO.getCityProper().getCity().getRegion(), villageVO.getCityProper().getCity().getRegion());

		return villageVO;
	}

}
