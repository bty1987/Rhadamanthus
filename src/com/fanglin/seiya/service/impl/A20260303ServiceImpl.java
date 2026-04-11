/**
 * @File Name		: A20260303ServiceImpl.java
 * @Package   	: com.fanglin.seiya.service.impl
 * @Version		: 1.0
 * @Date			: 2026-03-03
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: Village楼盘数据同步实现
 */

package com.fanglin.seiya.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.BuildingNameRuleDao;
import com.fanglin.communion.dao.VillageDao;
import com.fanglin.communion.dao.VillageRuleDao;
import com.fanglin.communion.po.BuildingNameRulePO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.communion.po.VillageRulePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.seiya.service.A20260303Service;
import com.fanglin.system.dao.CityDao;
import com.fanglin.system.dao.CityProperDao;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.RegionDao;
import com.fanglin.system.po.CityPO;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.RegionPO;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("A20260303Service")
@Transactional
public class A20260303ServiceImpl implements A20260303Service {

	private static final Logger logger = LoggerFactory.getLogger(A20260303ServiceImpl.class);

	@Autowired
	private VillageDao villageDao;

	@Autowired
	private CityDao cityDao;

	@Autowired
	private CityProperDao cityProperDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private BuildingNameRuleDao buildingNameRuleDao;

	@Autowired
	private VillageRuleDao villageRuleDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private RegionDao regionDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Object> syncVillage(String vid, String name, String proper, String city, String pvid, Integer company, String no, JSONArray ruleArray, Double x, Double y, Long companyDistance) throws FLException {

		Map<String, Object> result = new HashMap<String, Object>();

		try {
			logger.info("同步楼盘数据: vid={}, name={}, proper={}, city={}, pvid={}, company={}, no={}, x={}, y={}, companyDistance={}", vid, name, proper, city, pvid, company, no, x, y, companyDistance);

			// 0. 验证公司是否存在
			if (company == null) {
				throw new FLException(510000, "公司ID不能为空");
			}
			CompanyPO companyPO = companyDao.get(company);
			if (companyPO == null) {
				throw new FLException(510000, "公司不存在: " + company);
			}

			// 1. 通过城市名称查找城市，不存在则自动创建
			CityPO cityPO = queryCityByName(city);
			if (cityPO == null) {
				logger.info("城市不存在，自动创建: city={}", city);
				cityPO = createCity(city);
				logger.info("城市创建成功: cid={}, name={}", cityPO.getCid(), cityPO.getName());
			}

			// 2. 通过城市和区域名称查找城区，不存在则自动创建
			CityProperPO cityProperPO = queryCityProperByNameAndCity(proper, cityPO.getCid());
			if (cityProperPO == null) {
				logger.info("城区不存在，自动创建: proper={}, cityCid={}", proper, cityPO.getCid());
				cityProperPO = createCityProper(proper, cityPO);
				logger.info("城区创建成功: cpid={}, name={}", cityProperPO.getCpid(), cityProperPO.getName());
			}

			// 3. 判断是新增还是更新
			VillagePO villagePO = null;
			String operation = "add";

			if (vid != null && !vid.trim().isEmpty()) {
				// vid 不为空，尝试查找现有楼盘进行更新
				try {
					long vidLong = Long.parseLong(vid);
					villagePO = villageDao.queryVillage(vidLong);
					if (villagePO != null) {
						operation = "update";
					}
				} catch (NumberFormatException e) {
					// vid 格式不正确，视为新增
					logger.warn("vid格式不正确，视为新增: vid={}", vid);
				}
			}

			// 4. 构建 VillagePO 对象
			if (villagePO == null) {
				// 新增：创建新对象
				villagePO = new VillagePO();

				// 处理楼盘编号 no
				if (no != null && !no.trim().isEmpty()) {
					// 使用传入的 no 参数
					String trimmedNo = no.trim();

					// 唯一性验证：检查 no 是否已存在
					VillagePO existingVillage = villageDao.queryVillageByNo(trimmedNo);
					if (existingVillage != null) {
						throw new FLException(400005, "楼盘编号已存在: " + trimmedNo);
					}

					villagePO.setNo(trimmedNo);
					logger.info("使用传入的楼盘编号: no={}", trimmedNo);
				} else {
					// no 为空，自动生成楼盘编号
					int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_VILLAGE_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);
					StringBuffer autoNo = new StringBuffer();
					autoNo.append(String.format("%sP-", companyPO.getShortname()));
					autoNo.append(FormatUtil.fillZero(count, "00000"));
					villagePO.setNo(autoNo.toString());
					logger.info("自动生成楼盘编号: no={}", autoNo.toString());
				}
			} else {
				// 更新：如果传入了 no 参数，且与现有值不同，则更新
				if (no != null && !no.trim().isEmpty()) {
					String trimmedNo = no.trim();
					if (!trimmedNo.equals(villagePO.getNo())) {
						// 唯一性验证：检查新 no 是否已被其他楼盘使用
						VillagePO existingVillage = villageDao.queryVillageByNo(trimmedNo);
						if (existingVillage != null && existingVillage.getVid() != villagePO.getVid()) {
							throw new FLException(400005, "楼盘编号已被其他楼盘使用: " + trimmedNo);
						}
						villagePO.setNo(trimmedNo);
						logger.info("更新楼盘编号: no={}", trimmedNo);
					}
				}
			}

			// 设置基本信息
			villagePO.setName(name);
			villagePO.setCityProper(new CityProperPO(cityProperPO.getCpid()));
			villagePO.setCid(cityPO.getCid());
			villagePO.setCompany(company);

			// 设置 rule（从 ruleArray 中提取第一个 comment）
			if (ruleArray != null && !ruleArray.isEmpty()) {
				JSONObject firstRule = ruleArray.getJSONObject(0);
				String comment = firstRule.getString("comment");
				if (comment != null && !comment.trim().isEmpty()) {
					villagePO.setRule(comment);
				}
			}

			// 设置坐标（乘以1000000转为整数）
			if (x != null) {
				villagePO.setX((int) (x * 1000000));
			}
			if (y != null) {
				villagePO.setY((int) (y * 1000000));
			}

			// 设置公司距离（需要乘以1000后保存到数据库）
			if (companyDistance != null) {
				villagePO.setMileage(companyDistance * 1000);
			}

			List<String> pinyinList = (List<String>) PinYin4Util.getPinyin(name);
			if (pinyinList != null && !pinyinList.isEmpty()) {
				villagePO.setPinyinAll(pinyinList.get(0));
			}

			List<String> pinyinABList = (List<String>) PinYin4Util.getPinYinHeadChar(name);
			if (pinyinABList != null && !pinyinABList.isEmpty()) {
				villagePO.setPinyinAB(pinyinABList.get(0));
			}

			// 设置父级楼盘（如果 pvid 不为空）
			if (pvid != null && !pvid.trim().isEmpty()) {
				try {
					long pvidLong = Long.parseLong(pvid);
					VillagePO parentVillage = villageDao.queryVillage(pvidLong);
					if (parentVillage != null) {
						villagePO.setParentVillage(parentVillage);
					} else {
						logger.warn("父级楼盘不存在: pvid={}", pvid);
					}
				} catch (NumberFormatException e) {
					logger.warn("pvid格式不正确: pvid={}", pvid);
				}
			} else {
				villagePO.setParentVillage(null);
			}

			// 5. 保存或更新楼盘
			if ("update".equals(operation)) {
				villageDao.update(villagePO);
				logger.info("更新楼盘成功: vid={}, no={}, name={}", villagePO.getVid(), villagePO.getNo(), villagePO.getName());
			} else {
				villageDao.save(villagePO);
				// 刷新以获取生成的 vid
				villageDao.flush();
				villageDao.refresh(villagePO);
				logger.info("新增楼盘成功: vid={}, no={}, name={}", villagePO.getVid(), villagePO.getNo(), villagePO.getName());
			}

			// 6. 处理规则数组（只关联已存在的规则，不创建）
			if (ruleArray != null && !ruleArray.isEmpty()) {
				// 先删除原有规则（如果是更新操作）
				if ("update".equals(operation)) {
					List<VillageRulePO> existingRules = villageRuleDao.queryVillageRule(villagePO.getVid());
					if (existingRules != null) {
						for (VillageRulePO existingRule : existingRules) {
							villageRuleDao.delete(existingRule);
						}
						logger.info("删除原有楼盘规则: vid={}, count={}", villagePO.getVid(), existingRules.size());
					}
				}

				// 添加新规则关联
				for (int i = 0; i < ruleArray.size(); i++) {
					JSONObject ruleObj = ruleArray.getJSONObject(i);
					String rule = ruleObj.getString("rule");
					String comment = ruleObj.getString("comment");

					if (rule != null && !rule.trim().isEmpty()) {
						// 查找规则，不存在则自动创建
						BuildingNameRulePO buildingNameRulePO = findBuildingNameRule(rule);
						if (buildingNameRulePO == null) {
							logger.info("规则不存在，自动创建: rule={}", rule);
							buildingNameRulePO = createBuildingNameRule(rule, comment);
							logger.info("规则创建成功: bnrid={}, rule={}", buildingNameRulePO.getId(), rule);
						}

						// 创建 VillageRule 关联
						VillageRulePO villageRulePO = new VillageRulePO();
						villageRulePO.setVid(villagePO.getVid());
						villageRulePO.setRule(buildingNameRulePO);
						villageRuleDao.save(villageRulePO);

						logger.info("添加楼盘规则关联成功: vid={}, rule={}", villagePO.getVid(), rule);
					}
				}
			}

			// 7. 返回结果
			result.put("success", true);
			result.put("operation", operation);
			result.put("vid", villagePO.getVid());
			result.put("no", villagePO.getNo());
			result.put("name", villagePO.getName());
			result.put("cpid", cityProperPO.getCpid());
			result.put("cid", cityPO.getCid());

			return result;

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			logger.error("同步楼盘异常: name={}, proper={}, city={}, company={}", name, proper, city, company, e);
			throw new FLException(500003, "同步楼盘失败: " + e.getMessage());
		}
	}

	/**
	 * 通过名称查询城市
	 * 
	 * @param cityName 城市名称
	 * @return CityPO
	 */
	private CityPO queryCityByName(String cityName) {
		return cityDao.queryCity(cityName);
	}

	/**
	 * 通过名称和城市ID查询城区
	 * 
	 * @param properName 城区名称
	 * @param cid 城市ID
	 * @return CityProperPO
	 */
	private CityProperPO queryCityProperByNameAndCity(String properName, Integer cid) {
		// 先通过名称查询城区
		CityProperPO cityProper = cityProperDao.queryCityProper(properName);
		// 验证该城区是否属于指定的城市
		if (cityProper != null && cityProper.getCity() != null && cityProper.getCity().getCid() == cid) {
			return cityProper;
		}
		return null;
	}

	/**
	 * 通过规则表达式查找楼栋名称规则（不创建）
	 * 
	 * @param rule 规则表达式
	 * @return BuildingNameRulePO，不存在则返回null
	 */
	private BuildingNameRulePO findBuildingNameRule(String rule) {
		List<Filter> filters = new java.util.ArrayList<Filter>();
		filters.add(new Filter("rule", rule, "eq"));
		List<BuildingNameRulePO> existingRules = buildingNameRuleDao.pageBuildingNameRule(new Paging(0, 1), filters);

		if (existingRules != null && !existingRules.isEmpty()) {
			return existingRules.get(0);
		}
		return null;
	}

	/**
	 * 创建城市
	 * 
	 * @param cityName 城市名称
	 * @return 创建的CityPO
	 */
	private CityPO createCity(String cityName) {
		CityPO cityPO = new CityPO();

		// 生成城市编号
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CITY_INT, CountingPO.COUNTING_DATE_SILNLE_STR, 0);
		StringBuffer no = new StringBuffer();
		no.append("C_");
		no.append(FormatUtil.fillZero(count, "00"));
		cityPO.setNo(no.toString());

		// 设置城市名称
		cityPO.setName(cityName);

		// 从城市名称中提取省份（如"沈阳市"提取"辽宁省"，默认使用城市名称）
		String province = extractProvinceFromCityName(cityName);
		cityPO.setProvince(province);

		// 生成拼音
		List<String> pinyinList = (List<String>) PinYin4Util.getPinyin(cityName);
		if (pinyinList != null && !pinyinList.isEmpty()) {
			cityPO.setPinyin(pinyinList.get(0));
		}

		// 获取或创建默认大区（rid 字段 NOT NULL，必须设置）
		RegionPO regionPO = getOrCreateDefaultRegion();
		cityPO.setRegion(regionPO);

		// 保存并刷新以获取生成的cid
		cityDao.save(cityPO);
		cityDao.flush();
		cityDao.refresh(cityPO);

		return cityPO;
	}

	/**
	 * 创建城区
	 * 
	 * @param properName 城区名称
	 * @param cityPO 所属城市
	 * @return 创建的CityProperPO
	 */
	private CityProperPO createCityProper(String properName, CityPO cityPO) {
		CityProperPO cityProperPO = new CityProperPO();

		// 生成城区编号
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CITY_PROPER_INT, CountingPO.COUNTING_DATE_SILNLE_STR, 0);
		StringBuffer no = new StringBuffer();
		no.append("R_");
		no.append(FormatUtil.fillZero(count, "000"));
		cityProperPO.setNo(no.toString());

		// 设置城区名称
		cityProperPO.setName(properName);

		// 关联城市
		cityProperPO.setCity(cityPO);

		// 生成拼音
		List<String> pinyinList = (List<String>) PinYin4Util.getPinyin(properName);
		if (pinyinList != null && !pinyinList.isEmpty()) {
			cityProperPO.setPinyin(pinyinList.get(0));
		}

		// 保存并刷新以获取生成的cpid
		cityProperDao.save(cityProperPO);
		cityProperDao.flush();
		cityProperDao.refresh(cityProperPO);

		return cityProperPO;
	}

	/**
	 * 从城市名称中提取省份 简单规则：如果城市名称以"市"结尾，则提取或推测省份
	 * 
	 * @param cityName 城市名称
	 * @return 省份名称
	 */
	private String extractProvinceFromCityName(String cityName) {
		if (cityName == null || cityName.isEmpty()) {
			return "";
		}

		// 常见的直辖市
		if (cityName.contains("北京")) {
			return "北京市";
		}
		if (cityName.contains("上海")) {
			return "上海市";
		}
		if (cityName.contains("天津")) {
			return "天津市";
		}
		if (cityName.contains("重庆")) {
			return "重庆市";
		}

		// 如果城市名称以"市"结尾，去掉"市"作为省份的参考
		if (cityName.endsWith("市")) {
			// 尝试从第一个字符提取省份（简单处理）
			// 实际项目中可能需要更完善的地区映射表
			return cityName.replace("市", "省"); // 简单替换，如"沈阳市" -> "沈阳省"
		}

		// 默认返回原城市名称
		return cityName;
	}

	/**
	 * 获取或创建默认大区 用于解决 city 表 rid 字段 NOT NULL 的约束问题
	 * 
	 * @return 默认的 RegionPO
	 */
	private RegionPO getOrCreateDefaultRegion() {
		// 先尝试查找名为"默认大区"的 Region
		RegionPO region = regionDao.queryRegion("默认大区");
		if (region != null) {
			return region;
		}

		// 如果不存在，查找第一个可用的 Region
		List<RegionPO> regions = regionDao.queryRegion();
		if (regions != null && !regions.isEmpty()) {
			return regions.get(0);
		}

		// 如果没有任何 Region，创建一个默认的
		RegionPO defaultRegion = new RegionPO();
		defaultRegion.setName("默认大区");
		defaultRegion.setNo("R_DEFAULT");
		defaultRegion.setPinyin("morendaqu");
		defaultRegion.setX(0);
		defaultRegion.setY(0);

		regionDao.save(defaultRegion);
		regionDao.flush();
		regionDao.refresh(defaultRegion);

		logger.info("创建默认大区: rid={}", defaultRegion.getRid());
		return defaultRegion;
	}

	/**
	 * 创建楼栋名称规则
	 * 
	 * @param rule 规则表达式（如：\d+#\d+-\d）
	 * @param comment 规则说明（可为空）
	 * @return 创建的 BuildingNameRulePO
	 */
	private BuildingNameRulePO createBuildingNameRule(String rule, String comment) {
		BuildingNameRulePO buildingNameRulePO = new BuildingNameRulePO();

		// 生成规则编号
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_BUILDING_NAME_RULE_INT, CountingPO.COUNTING_DATE_SILNLE_STR, 0);
		StringBuffer no = new StringBuffer();
		no.append("BNR-");
		no.append(FormatUtil.fillZero(count, "00000"));
		buildingNameRulePO.setBuildingNameRuleId(no.toString());

		// 设置规则表达式和说明
		buildingNameRulePO.setRule(rule);

		// 设置规则示例（使用 comment 或 rule，不能为 null）
		if (comment != null && !comment.trim().isEmpty()) {
			buildingNameRulePO.setRuleExample(comment);
		} else {
			buildingNameRulePO.setRuleExample(rule); // 默认使用规则表达式作为示例
		}

		// 设置规则内容
		if (comment != null && !comment.trim().isEmpty()) {
			buildingNameRulePO.setRuleContent(comment);
		} else {
			buildingNameRulePO.setRuleContent(rule); // 默认使用规则表达式作为说明
		}

		// 保存并刷新以获取生成的bnrid
		buildingNameRuleDao.save(buildingNameRulePO);
		buildingNameRuleDao.flush();
		buildingNameRuleDao.refresh(buildingNameRulePO);

		return buildingNameRulePO;
	}

}
