/**
 * @File Name		: A20260904ServiceImpl.java
 * @Package   	: com.fanglin.seiya.service.impl
 * @Version		: 1.0
 * @Date			: 2026-09-04
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 库存数据同步服务实现（辅材/仓库/出入库）
 */

package com.fanglin.seiya.service.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.dao.AccessoriesTypeDao;
import com.fanglin.data.material.dao.AoodsDao;
import com.fanglin.data.material.dao.ColorDao;
import com.fanglin.data.material.dao.FormatDao;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.po.AccessoriesTypePO;
import com.fanglin.data.po.AoodsPO;
import com.fanglin.data.po.ColorPO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.inventory.dao.GoodsStorehouseStockDao;
import com.fanglin.inventory.dao.ManifestDao;
import com.fanglin.inventory.dao.ManifestItemDao;
import com.fanglin.inventory.dao.StorehouseDao;
import com.fanglin.inventory.po.GoodsStorehouseStockPO;
import com.fanglin.inventory.po.ManifestItemPO;
import com.fanglin.inventory.po.ManifestPO;
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.inventory.service.GoodsStorehouseStockService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.seiya.service.A20260904Service;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.PinYin4Util;

@Service("a20260904Service")
@Transactional(readOnly = true)
public class A20260904ServiceImpl implements A20260904Service {

	@Autowired
	private AoodsDao aoodsDao;

	@Autowired
	private GoodsDao goodsDao;

	@Autowired
	private ColorDao colorDao;

	@Autowired
	private FormatDao formatDao;

	@Autowired
	private AccessoriesTypeDao accessoriesTypeDao;

	@Autowired
	private StorehouseDao storehouseDao;

	@Autowired
	private ManifestDao manifestDao;

	@Autowired
	private ManifestItemDao manifestItemDao;

	@Autowired
	private GoodsStorehouseStockDao goodsStorehouseStockDao;

	@Autowired
	private GoodsStorehouseStockService goodsStorehouseStockService;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CountingService countingService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Object> syncAoods(String no, String name, String measurementUnit, String normunit, Integer normnum, String storeunit, Integer storenum, Long atid, Integer company) throws FLException {

		GoodsPO goodsPO = goodsDao.queryGoodsByNo(no, company);

		if (goodsPO == null) {

			goodsPO = new GoodsPO();

			goodsPO.setNo(no);
			goodsPO.setName(name);
			goodsPO.setPinyin(PinYin4Util.getPinyin(name).get(0));
			goodsPO.setMeasurementUnit(measurementUnit == null ? "" : measurementUnit);
			goodsPO.setBrand("");
			goodsPO.setStatus(GoodsPO.STATUS_ENABLE_INT);
			goodsPO.setCompany(company);

			goodsDao.save(goodsPO);

			// 辅材无颜色/规格概念，创建商品时同步建默认颜色/规格，供库存维度(gid+cid+fid+shid)挂靠
			makeDefaultColor(goodsPO.getGid());
			makeDefaultFormat(goodsPO.getGid());
		} else {

			if (name != null && !name.trim().isEmpty()) {
				goodsPO.setName(name);
				goodsPO.setPinyin(PinYin4Util.getPinyin(name).get(0));
			}

			if (measurementUnit != null && !measurementUnit.trim().isEmpty()) goodsPO.setMeasurementUnit(measurementUnit);

			goodsDao.update(goodsPO);
		}

		AoodsPO aoodsPO = aoodsDao.queryAoods(goodsPO.getGid(), company);

		String operation;

		if (aoodsPO == null) {

			aoodsPO = new AoodsPO();

			aoodsPO.setName(name);
			aoodsPO.setGoods(new GoodsPO(goodsPO.getGid()));

			if (atid != null) aoodsPO.setAccessoriesType(queryAccessoriesType(atid));

			aoodsPO.setNormunit(normunit == null ? "" : normunit);
			aoodsPO.setNormnum(normnum == null ? 0 : normnum);
			aoodsPO.setStoreunit(storeunit == null ? "" : storeunit);
			aoodsPO.setStorenum(storenum == null ? 0 : storenum);

			aoodsPO.setStatus(AoodsPO.STATUS_ENABLE_INT);
			aoodsPO.setCheckup(AoodsPO.CHECKUP_CHECK_INT);

			aoodsPO.setCompany(company);
			aoodsPO.setBompany(company);

			aoodsDao.save(aoodsPO);

			operation = "add";
		} else {

			if (name != null && !name.trim().isEmpty()) aoodsPO.setName(name);

			if (atid != null) aoodsPO.setAccessoriesType(queryAccessoriesType(atid));

			if (normunit != null) aoodsPO.setNormunit(normunit);
			if (normnum != null) aoodsPO.setNormnum(normnum);
			if (storeunit != null) aoodsPO.setStoreunit(storeunit);
			if (storenum != null) aoodsPO.setStorenum(storenum);

			aoodsDao.update(aoodsPO);

			operation = "update";
		}

		Map<String, Object> result = new HashMap<String, Object>();

		result.put("success", true);
		result.put("operation", operation);
		result.put("no", no);
		result.put("name", name);
		result.put("aid", aoodsPO.getAid());
		result.put("gid", goodsPO.getGid());

		return result;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Object> syncStorehouse(String code, String name, Integer status) throws FLException {

		StorehousePO storehousePO = storehouseDao.queryStroehouseByCode(code);

		String operation;

		if (storehousePO == null) {

			storehousePO = new StorehousePO();

			storehousePO.setCode(code);
			storehousePO.setName(name);
			storehousePO.setStatus(status == null ? StorehousePO.STATUS_ENABLE_INT : status.shortValue());

			storehouseDao.save(storehousePO);

			operation = "add";
		} else {

			if (name != null && !name.trim().isEmpty()) storehousePO.setName(name);
			if (status != null) storehousePO.setStatus(status.shortValue());

			storehouseDao.update(storehousePO);

			operation = "update";
		}

		Map<String, Object> result = new HashMap<String, Object>();

		result.put("success", true);
		result.put("operation", operation);
		result.put("shid", storehousePO.getShid());
		result.put("code", storehousePO.getCode());
		result.put("name", storehousePO.getName());

		return result;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Object> syncStorehouseStock(String no, String storehouseCode, String type, Integer num, String manifestTime, String comment, Integer company, String userId) throws FLException {

		boolean isIn = "in".equals(type);

		// 1. 辅材/商品存在性校验（不存在直接返回）
		GoodsPO goodsPO = goodsDao.queryGoodsByNo(no, company);

		if (goodsPO == null) {
			throw new FLException(400037, "辅材不存在");
		}

		AoodsPO aoodsPO = aoodsDao.queryAoods(goodsPO.getGid(), company);

		if (aoodsPO == null) {
			throw new FLException(400037, "辅材不存在");
		}

		// 2. 仓库存在性校验（不存在直接返回）
		StorehousePO storehousePO = storehouseDao.queryStroehouseByCode(storehouseCode);

		if (storehousePO == null) {
			throw new FLException(400038, "仓库不存在");
		}

		// 3. 操作账号校验
		UserPO creater = userDao.queryUserByUserId(userId);

		if (creater == null) {
			throw new FLException(400040, "操作账号无效");
		}

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		// 4. 单据时间解析（缺省当前时间）
		Timestamp manifestTimestamp = DateUtil.getDateToTimestamp(new Date());

		if (manifestTime != null && !manifestTime.trim().isEmpty()) {

			Date date = DateUtil.parseDate(manifestTime.trim(), "yyyy-MM-dd HH:mm:ss");

			if (date == null) {
				throw new FLException(400041, "单据时间格式无效");
			}

			manifestTimestamp = DateUtil.getDateToTimestamp(date);
		}

		// 5. 定位库存挂靠的默认颜色/规格
		long cid = queryDefaultColor(goodsPO.getGid());
		long fid = queryDefaultFormat(goodsPO.getGid());

		// 6. 生成 manifest 单据（in=CG 进货入库 / out=XG 出货出库）
		short manifestType = isIn ? ManifestPO.TYPE_CG_INT : ManifestPO.TYPE_XG_INT;
		int countingType = isIn ? CountingPO.TYPE_INVENTORY_CG_INT : CountingPO.TYPE_INVENTORY_XG_INT;
		String countingNo = isIn ? "CG" : "XG";

		int count = countingService.queryCountingByTypeDate(countingType, DateUtil.current("yyMMdd").toString(), company);

		String manifestCode = String.format("%s%s%s%s", companyPO.getShortname(), countingNo, DateUtil.current("yyyyMMdd").toString().substring(2), FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		ManifestPO manifestPO = new ManifestPO().init(manifestCode, manifestType, creater, manifestTimestamp, "", comment == null ? "" : comment, null, company);

		manifestDao.save(manifestPO);

		// 7. 出入库（instorehouse 内部含商品/仓库/色规校验并自动建库存行；outstorehouse 内部含库存存在/充足校验）
		StorehousePO stockStorehousePO;

		if (isIn) {
			stockStorehousePO = goodsStorehouseStockService.instorehouse(goodsPO.getGid(), cid, fid, storehousePO.getShid(), num);
		} else {
			stockStorehousePO = goodsStorehouseStockService.outstorehouse(goodsPO.getGid(), cid, fid, storehousePO.getShid(), num);
		}

		// 8. manifest 明细
		ManifestItemPO manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), null, null, null, null, goodsPO.getGid(), cid, fid, manifestType, 0, 0, num, isIn ? stockStorehousePO : null, isIn ? null : stockStorehousePO);

		manifestItemPO.setComment(comment == null ? "" : comment);

		manifestItemDao.save(manifestItemPO);

		// 9. 操作后库存余量
		GoodsStorehouseStockPO goodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShidAGid(goodsPO.getGid(), cid, fid, storehousePO.getShid());

		Map<String, Object> result = new HashMap<String, Object>();

		result.put("success", true);
		result.put("operation", type);
		result.put("mid", manifestPO.getMid());
		result.put("manifestCode", manifestCode);
		result.put("no", no);
		result.put("name", aoodsPO.getName());
		result.put("storehouseCode", storehouseCode);
		result.put("num", goodsStorehouseStockPO.getNum());

		return result;
	}

	private AccessoriesTypePO queryAccessoriesType(long atid) throws FLException {

		AccessoriesTypePO accessoriesTypePO = accessoriesTypeDao.get(atid);

		if (accessoriesTypePO == null) {
			throw new FLException(400042, "辅材分类无效");
		}

		return accessoriesTypePO;
	}

	private long makeDefaultColor(long gid) {

		ColorPO colorPO = new ColorPO();

		colorPO.setGid(gid);
		colorPO.setName("默认");
		colorPO.setStatus(ColorPO.STATUS_ENABLE_INT);

		colorDao.save(colorPO);

		return colorPO.getCid();
	}

	private long makeDefaultFormat(long gid) {

		FormatPO formatPO = new FormatPO();

		formatPO.setGid(gid);
		formatPO.setInfo("默认");
		formatPO.setStatus(FormatPO.STATUS_ENABLE_INT);

		formatDao.save(formatPO);

		return formatPO.getFid();
	}

	private long queryDefaultColor(long gid) {

		ColorPO colorPO = colorDao.queryColorByName(gid, "默认");

		if (colorPO != null) return colorPO.getCid();

		List<ColorPO> colorPOs = colorDao.queryColorForEnableByGid(gid);

		if (colorPOs != null && !colorPOs.isEmpty()) return colorPOs.get(0).getCid();

		return makeDefaultColor(gid);
	}

	private long queryDefaultFormat(long gid) {

		FormatPO formatPO = formatDao.queryFormatByInfo(gid, "默认");

		if (formatPO != null) return formatPO.getFid();

		List<FormatPO> formatPOs = formatDao.queryFormatForEnableByGid(gid);

		if (formatPOs != null && !formatPOs.isEmpty()) return formatPOs.get(0).getFid();

		return makeDefaultFormat(gid);
	}

}
