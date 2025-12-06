package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
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
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.HttpUtil;
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
			villageVOs.add(villagePO.ptv(new VillageVO(new CityProperVO(new CityVO()), new VillageVO())));
		}

		paging.setData(villageVOs);
	}

	@Override
	public VillageVO queryVillageByVid(VillageVO villageVO) throws FLException {

		VillagePO villagePO = villageDao.get(villageVO.getNo());

		if (villagePO == null) {
			throw new FLException(130003, "楼盘信息不存在");
		}

		villageVO.setCityProper(new CityProperVO(new CityVO()));

		return villagePO.ptv(villageVO);
	}

	@Override
	public List<VillageVO> queryVillageForNameByPinyin(String pinyinName, VillageVO village, Integer company) {

		Paging paging = new Paging(0, 20);

		List<VillageVO> villageVOs = new ArrayList<VillageVO>();

		Long pvid = village == null ? null : village.getParentVillage().getVid();

		List<VillagePO> villagePOs = villageDao.queryVillageByPinyin(paging, pinyinName, pvid, company);

		for (VillagePO villagePO : villagePOs) {
			villageVOs.add(villagePO.ptv(new VillageVO(new CityProperVO(new CityVO()), new VillageVO())));
		}

		return villageVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addVillage(VillageVO villageVO, Integer company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		VillagePO villagePO = new VillagePO();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_VILLAGE_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

		StringBuffer no = new StringBuffer();
		no.append(String.format("%sP-", companyPO.getShortname()));
		no.append(FormatUtil.fillZero(count, "00000"));

		villagePO.setNo(no.toString());

		BeanUtil.copyProperties(villageVO, villagePO, Arrays.asList("no", "cityProper", "parentVillage"));

		if (villageVO.getParentVillage() != null) villagePO.setParentVillage(villageDao.get(villageVO.getParentVillage().getNo()));

		villagePO.setCityProper(new CityProperPO(villageVO.getCityProper().getCpid()));

		villagePO.setPinyinAB((String) PinYin4Util.getPinYinHeadChar(villageVO.getName()).get(0));
		villagePO.setPinyinAll((String) PinYin4Util.getPinyin(villageVO.getName()).get(0));

		villagePO.setCompany(company);

		villageDao.save(villagePO);

		villageDao.flush();
		villageDao.refresh(villagePO);

		if (villagePO.getParentVillage() == null) {
			villagePO.setParentVillage(villagePO);
			villageDao.update(villagePO);
		}

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

		BeanUtil.copyProperties(villageVO, villagePO, Arrays.asList("no", "x", "y", "cityProper", "parentVillage", "company"));

		villagePO.setCityProper(new CityProperPO(villageVO.getCityProper().getCpid()));
		villagePO.setPinyinAB((String) PinYin4Util.getPinYinHeadChar(villageVO.getName()).get(0));
		villagePO.setPinyinAll((String) PinYin4Util.getPinyin(villageVO.getName()).get(0));
		villagePO.setMileage(villageVO.getMileage());

		if (villageVO.getParentVillage() != null) villagePO.setParentVillage(villageDao.get(villageVO.getParentVillage().getNo()));

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

	@Override
	@Transactional(rollbackFor = Exception.class)
	public VillageVO locateVillage(VillageVO villageVO) throws FLException {

		// 1. 查询楼盘信息
		VillagePO villagePO = villageDao.get(villageVO.getNo());

		if (villagePO == null) {
			throw new FLException(130003, "楼盘信息不存在");
		}

		// 2. 获取楼盘名称和城市名称
		String villageName = villagePO.getName();
		String cityName = villagePO.getCityProper().getCity().getName();

		// 3. 调用腾讯地图API获取坐标
		String apiUrl = String.format(
			"https://apis.map.qq.com/ws/place/v1/search?keyword=%s&region=%s&output=json&key=PAXBZ-GJZ3T-K2JXQ-LUN5D-IPF47-XZBUV",
			villageName, cityName
		);

		JSONObject result = HttpUtil.httpGet(apiUrl);

		if (result == null) {
			throw new FLException(130021, "调用地图API失败");
		}

		// 4. 解析返回的经纬度
		Integer status = result.getInteger("status");
		if (status == null || status != 0) {
			throw new FLException(130022, "地图API返回错误: " + result.getString("message"));
		}

		JSONArray dataArray = result.getJSONArray("data");
		if (dataArray == null || dataArray.isEmpty()) {
			throw new FLException(130023, "未找到楼盘位置信息");
		}

		JSONObject firstResult = dataArray.getJSONObject(0);
		JSONObject location = firstResult.getJSONObject("location");

		if (location == null) {
			throw new FLException(130024, "地图API返回数据格式错误");
		}

		Double lng = location.getDouble("lng");
		Double lat = location.getDouble("lat");

		if (lng == null || lat == null) {
			throw new FLException(130025, "无法获取经纬度坐标");
		}

		// 5. 更新楼盘的x和y字段 (乘以1000000存储为整数)
		villagePO.setX((int) (lng * 1000000));
		villagePO.setY((int) (lat * 1000000));

		villageDao.update(villagePO);

		// 6. 返回更新后的楼盘信息
		VillageVO resultVO = new VillageVO(new CityProperVO(new CityVO()), new VillageVO());
		return villagePO.ptv(resultVO);
	}

}
