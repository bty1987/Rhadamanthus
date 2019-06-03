/**
 * @File Name		: ManifestServiceImpl.java
 * @Package   	: com.fanglin.inventory.service.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.AccessoriesDao;
import com.fanglin.inventory.dao.AccessoriesItemDao;
import com.fanglin.inventory.dao.AccessoriesManifestDao;
import com.fanglin.inventory.dao.ManifestDao;
import com.fanglin.inventory.dao.ManifestItemDao;
import com.fanglin.inventory.dao.PurchaseDao;
import com.fanglin.inventory.dao.PurchaseItemDao;
import com.fanglin.inventory.dao.PurchaseManifestDao;
import com.fanglin.inventory.po.AccessoriesItemPO;
import com.fanglin.inventory.po.AccessoriesManifestPO;
import com.fanglin.inventory.po.AccessoriesPO;
import com.fanglin.inventory.po.ManifestItemPO;
import com.fanglin.inventory.po.ManifestPO;
import com.fanglin.inventory.po.PurchaseItemPO;
import com.fanglin.inventory.po.PurchaseManifestPO;
import com.fanglin.inventory.po.PurchasePO;
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.inventory.service.GoodsStorehouseStockService;
import com.fanglin.inventory.service.ManifestService;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.inventory.vo.ManifestItemVO;
import com.fanglin.inventory.vo.ManifestVO;
import com.fanglin.inventory.vo.PurchaseItemVO;
import com.fanglin.inventory.vo.PurchaseVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesManifestDao;
import com.fanglin.sales.po.SalesManifestPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("manifestService")
@Transactional(readOnly = true)
public class ManifestServiceImpl implements ManifestService {

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private ManifestDao manifestDao;

	@Autowired
	private ManifestItemDao manifestItemDao;

	@Autowired
	private PurchaseDao purchaseDao;

	@Autowired
	private PurchaseItemDao purchaseItemDao;

	@Autowired
	private AccessoriesDao accessoriesDao;
	
	@Autowired
	private AccessoriesItemDao accessoriesItemDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private AccessoriesManifestDao accessoriesManifestDao;

	@Autowired
	private PurchaseManifestDao purchaseManifestDao;

	@Autowired
	private GoodsStorehouseStockService goodsStorehouseStockService;

	@Autowired
	private CountingService countingService;

	@Autowired
	private SalesManifestDao salesManifestDao;

	@Override
	public void pageManifest(Paging paging, List<Filter> filters, int company) {

		List<ManifestPO> manifestPOs = manifestDao.pageManifest(paging, filters, company);
		List<ManifestVO> manifestVOs = new ArrayList<ManifestVO>();

		ManifestVO manifestVO;

		for (ManifestPO manifestPO : manifestPOs) {
			manifestVO = new ManifestVO(new UserBaseVO());

			BeanUtil.copyProperties(manifestPO, manifestVO, Arrays.asList("creater", "quoteManifest"));
			manifestVO.getCreater().setBaseInfo(manifestPO.getCreater());

			manifestVOs.add(manifestVO);
		}

		paging.setData(manifestVOs);
	}

	@Override
	public ManifestVO queryManifestByMid(ManifestVO manifestVO) {

		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());

		manifestVO = new ManifestVO(new UserBaseVO());

		BeanUtil.copyProperties(manifestPO, manifestVO, Arrays.asList("creater", "quoteManifest"));
		manifestVO.getCreater().setBaseInfo(manifestPO.getCreater());

		return manifestVO;
	}

	@Override
	public List<ManifestVO> queryManifestForPUByPids(List<Long> pids) {

		List<ManifestVO> manifestVOs = new ArrayList<ManifestVO>();

		if (pids == null || pids.size() == 0) {
			return manifestVOs;
		}

		List<PurchaseManifestPO> purchaseManifestPOs = purchaseManifestDao.queryPurchaseManifestByPids(pids);

		for (PurchaseManifestPO purchaseManifestPO : purchaseManifestPOs) {

			ManifestVO manifestVO = new ManifestVO(new UserBaseVO());

			BeanUtil.copyProperties(purchaseManifestPO.getManifest(), manifestVO, Arrays.asList("creater", "quoteManifest"));
			BeanUtil.copyProperties(purchaseManifestPO.getManifest().getCreater(), manifestVO.getCreater(), Arrays.asList("duty", "dept"));

			manifestVOs.add(manifestVO);
		}

		return manifestVOs;
	}

	@Override
	public List<ManifestVO> queryManifestForXGBySid(SalesVO salesVO) {

		List<SalesManifestPO> salesManifestVOs = salesManifestDao.querySalesManifestBySid(salesVO.getSid());

		List<ManifestVO> manifestVOs = new ArrayList<ManifestVO>();

		for (SalesManifestPO salesManifestPO : salesManifestVOs) {

			ManifestVO manifestVO = new ManifestVO(new UserBaseVO());

			BeanUtil.copyProperties(salesManifestPO.getManifest(), manifestVO, Arrays.asList("creater", "quoteManifest"));
			BeanUtil.copyProperties(salesManifestPO.getManifest().getCreater(), manifestVO.getCreater(), Arrays.asList("duty", "dept"));

			manifestVOs.add(manifestVO);
		}

		return manifestVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addManifestForCG(ManifestVO manifestVO, List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		if (manifestItemVOs == null || manifestItemVOs.size() < 0) {
			throw new FLException(260007, "货单无商品信息");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_CG_INT, DateUtil.current("yyMMdd").toString(), company);
		String no = String.format("%sCG%s%s", companyPO.getShortname(), DateUtil.current("yyyyMMdd").toString().substring(2), FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		ManifestPO manifestPO = new ManifestPO().init(no, ManifestPO.TYPE_CG_INT, creater, manifestVO.getManifestTime(), "", manifestVO.getComment(), null, company);

		manifestDao.save(manifestPO);

		ManifestItemPO manifestItemPO;

		for (ManifestItemVO manifestItemVO : manifestItemVOs) {

			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();

			float inprice = manifestItemVO.getInprice();
			float num = manifestItemVO.getNum();

			StorehousePO inStorehousePO = goodsStorehouseStockService.instorehouse(gid, cid, fid, manifestItemVO.getInstorehouse().getShid(), num);

			manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), null, null, null, null, gid, cid, fid, ManifestPO.TYPE_CG_INT, inprice, 0, num, inStorehousePO, null);

			manifestItemDao.save(manifestItemPO);
		}

		manifestDao.update(manifestPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addManifestForXG(ManifestVO manifestVO, List<ManifestItemVO> manifestItemVOs, List<Long> sids, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		if (manifestItemVOs == null || manifestItemVOs.size() < 0) {
			throw new FLException(260007, "货单无商品信息");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_XG_INT, currentDate, company);
		String no = String.format("%sXG%s%s", companyPO.getShortname(), currentDate, FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		ManifestPO manifestPO = new ManifestPO().init(no, ManifestPO.TYPE_XG_INT, creater, manifestVO.getManifestTime(), "", manifestVO.getComment(), null, company);

		manifestDao.save(manifestPO);

		ManifestItemPO manifestItemPO;

		for (ManifestItemVO manifestItemVO : manifestItemVOs) {

			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();

			float outprice = manifestItemVO.getOutprice();
			float num = manifestItemVO.getNum();

			StorehousePO outStorehousePO = goodsStorehouseStockService.outstorehouse(gid, cid, fid, manifestItemVO.getOutstorehouse().getShid(), num);

			manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), manifestItemVO.getSiid(), null, null, null, gid, cid, fid, ManifestPO.TYPE_XG_INT, 0, outprice, num, null, outStorehousePO);

			manifestItemDao.save(manifestItemPO);
		}

		if (sids != null && sids.size() != 0) {
			for (Long sid : sids) {
				salesManifestDao.save(new SalesManifestPO(new SalesPO(sid), manifestPO));
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addManifestForCR(ManifestVO manifestVO, List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());

		if (manifestPO == null) {
			throw new FLException(260052, "货单不存在");
		}

		if (manifestPO.getStatus() != ManifestPO.STATUS_CONFIRM_INT) {
			throw new FLException(260027, "货单状态不可操作");
		}

		if (manifestItemVOs == null || manifestItemVOs.size() <= 0) {
			throw new FLException(260007, "货单无商品信息");
		}

		ManifestItemPO manifestItemPO;

		UserPO creater = userDao.queryUserByUserId(userId);

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_CR_INT, currentDate, company);
		String no = String.format("%sCR%s%s", companyPO.getShortname(), currentDate, FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		ManifestPO manifestTO = new ManifestPO().init(no, ManifestPO.TYPE_CR_INT, creater, ManifestPO.STATUS_CONFIRM_INT, "", manifestVO.getComment(), manifestPO, company);

		manifestDao.save(manifestTO);

		for (ManifestItemVO manifestItemVO : manifestItemVOs) {

			manifestItemPO = manifestItemDao.get(manifestItemVO.getMiid());

			long gid = manifestItemPO.getGoods().getGid();
			long cid = manifestItemPO.getColor().getCid();
			long fid = manifestItemPO.getFormat().getFid();

			float outprice = manifestItemPO.getInprice();
			float num = manifestItemVO.getNum();

			if (manifestItemPO.getSurplus() < num) {
				throw new FLException(260026, "货单项数量不符");
			} else {
				manifestItemPO.setSurplus(Arith.sub(manifestItemPO.getSurplus(), num));
			}

			StorehousePO outStorehousePO = goodsStorehouseStockService.outstorehouse(gid, cid, fid, manifestItemPO.getInstorehouse().getShid(), num);

			ManifestItemPO manifestItemTO = new ManifestItemPO().init(manifestTO.getMid(), manifestItemPO.getSiid(), null, null, manifestItemPO.getMiid(), gid, cid, fid, ManifestPO.TYPE_CR_INT, 0, outprice, num, null, outStorehousePO);

			manifestItemDao.save(manifestItemTO);
			manifestItemDao.update(manifestItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addManifestForXB(ManifestVO manifestVO, List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		if (manifestItemVOs == null || manifestItemVOs.size() <= 0) {
			throw new FLException(260007, "货单无商品信息");
		}

		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());

		if (manifestPO == null) {
			throw new FLException(260052, "货单不存在");
		}

		if (manifestPO.getStatus() != ManifestPO.STATUS_CONFIRM_INT) {
			throw new FLException(260027, "货单状态不可操作");
		}

		ManifestItemPO manifestItemPO;

		UserPO creater = userDao.queryUserByUserId(userId);

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_XB_INT, currentDate, company);
		String no = String.format("%sXB%s%s", companyPO.getShortname(), currentDate, FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		ManifestPO manifestTO = new ManifestPO().init(no, ManifestPO.TYPE_XB_INT, creater, ManifestPO.STATUS_CONFIRM_INT, "", "", manifestPO, company);

		manifestDao.save(manifestTO);

		for (ManifestItemVO manifestItemVO : manifestItemVOs) {

			manifestItemPO = manifestItemDao.get(manifestItemVO.getMiid());

			long gid = manifestItemPO.getGoods().getGid();
			long cid = manifestItemPO.getColor().getCid();
			long fid = manifestItemPO.getFormat().getFid();

			float inprice = manifestItemPO.getOutprice();
			float num = manifestItemVO.getNum();

			if (manifestItemPO.getSurplus() < num) {
				throw new FLException(260026, "货单项数量不符");
			} else {
				manifestItemPO.setSurplus(Arith.sub(manifestItemPO.getSurplus(), num));
			}

			StorehousePO inStorehousePO = goodsStorehouseStockService.instorehouse(gid, cid, fid, manifestItemPO.getOutstorehouse().getShid(), num);

			ManifestItemPO manifestItemTO = new ManifestItemPO().init(manifestTO.getMid(), manifestItemPO.getSiid(), null, null, manifestItemPO.getMiid(), gid, cid, fid, ManifestPO.TYPE_XB_INT, inprice, 0, num, inStorehousePO, null);

			manifestItemDao.save(manifestItemTO);
			manifestItemDao.update(manifestItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addManifestForDB(List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_DB_INT, currentDate, company);
		String no = String.format("%sDB%s%s", companyPO.getShortname(), currentDate, FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		ManifestPO manifestPO = new ManifestPO().init(no, ManifestPO.TYPE_DB_INT, creater, ManifestPO.STATUS_CONFIRM_INT, "", "", null, company);

		manifestDao.save(manifestPO);

		ManifestItemPO manifestItemPO;

		for (ManifestItemVO manifestItemVO : manifestItemVOs) {

			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();

			float inprice = manifestItemVO.getInprice();
			float outprice = manifestItemVO.getOutprice();
			float num = manifestItemVO.getNum();

			if (manifestItemVO.getInstorehouse() == null || manifestItemVO.getOutstorehouse() == null) {
				throw new FLException(260026, "货单项数量不符");
			}

			StorehousePO inStorehousePO = goodsStorehouseStockService.instorehouse(gid, cid, fid, manifestItemVO.getInstorehouse().getShid(), num);
			StorehousePO outStorehousePO = goodsStorehouseStockService.outstorehouse(gid, cid, fid, manifestItemVO.getOutstorehouse().getShid(), num);

			manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), null, null, null, null, gid, cid, fid, ManifestPO.TYPE_DB_INT, inprice, outprice, num, inStorehousePO, outStorehousePO);

			manifestItemDao.save(manifestItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addManifestForPU(List<PurchaseVO> purchaseVOs, List<PurchaseItemVO> purchaseItemVOs, String uid, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		if (purchaseVOs == null || purchaseVOs.size() <= 0) {
			throw new FLException(260017, "采购单不存在");
		}
		
		List<PurchasePO> purchasePOs = new ArrayList<PurchasePO>();
		PurchasePO purchasePO;

		for (PurchaseVO purchaseVO : purchaseVOs) {

			purchasePO = purchaseDao.get(purchaseVO.getPid());
			
			if (purchasePO.getStatus() == PurchasePO.STATUS_BATCHIN_ALL_INT) {
				throw new FLException(260018, "采购单状态不可操作");
			}

			purchasePOs.add(purchasePO);
		}

		UserPO creater = userDao.queryUserByUserId(uid);

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PU_INT, currentDate, company);
		String no = String.format("%sXB%s%s", companyPO.getShortname(), currentDate, FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		ManifestPO manifestPO = new ManifestPO().init(no, ManifestPO.TYPE_PU_INT, creater, ManifestPO.STATUS_CONFIRM_INT, "", "", null, company);

		manifestDao.save(manifestPO);

		ManifestItemPO manifestItemPO;

		for (PurchaseItemVO purchaseItemVO : purchaseItemVOs) {

			PurchaseItemPO purchaseItemPO = purchaseItemDao.get(purchaseItemVO.getPiid());

			long gid = purchaseItemPO.getGoods().getGid();
			long cid = purchaseItemPO.getColor().getCid();
			long fid = purchaseItemPO.getFormat().getFid();

			float inprice = purchaseItemPO.getInprice();
			float num = purchaseItemVO.getNum();

			if (purchaseItemPO.getSurplus() < num) {
				throw new FLException(260026, "采购项项数量不符");
			} else {
				purchaseItemPO.setSurplus(Arith.sub(purchaseItemPO.getSurplus(), num));
			}

			StorehousePO inStorehousePO = goodsStorehouseStockService.instorehouse(gid, cid, fid, purchaseItemVO.getStorehouse().getShid(), purchaseItemVO.getNum());

			manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), purchaseItemPO.getSiid(), purchaseItemPO.getPiid(), null, null, gid, cid, fid, ManifestPO.TYPE_PU_INT, inprice, 0, num, inStorehousePO, null);

			manifestItemDao.save(manifestItemPO);
			purchaseItemDao.update(purchaseItemPO);
		}
		
		purchaseItemDao.flush(); // 更新剩余数量 , 判断是否全部入库
		
		for (PurchasePO purchase : purchasePOs) {
			
			purchase.setStatus(purchaseItemDao.amountPurchaseItemForNum(purchase.getPid()) == 0.0f ? PurchasePO.STATUS_BATCHIN_ALL_INT : PurchasePO.STATUS_BATCHIN_PART_INT);
			
			purchaseManifestDao.save(new PurchaseManifestPO(purchase, manifestPO));
			purchaseDao.update(purchase);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addManifestForAS(List<AccessoriesVO> accessoriesVOs, List<AccessoriesItemVO> accessoriesItemVOs, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		if (accessoriesVOs == null || accessoriesVOs.size() <= 0) {
			throw new FLException(260023, "辅料单不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		List<AccessoriesPO> accessoriesPOs = new ArrayList<AccessoriesPO>();
		AccessoriesPO accessoriesPO;
		
		for (AccessoriesVO accessoriesVO : accessoriesVOs) {

			accessoriesPO = accessoriesDao.get(accessoriesVO.getAid());

			if (accessoriesPO.getStatus() != AccessoriesPO.STATUS_INIT_INT) {
				throw new FLException(260024, "辅料单状态不可操作");
			}

			accessoriesPO.setStatus(AccessoriesPO.STATUS_BATCHOUT_INT);
			accessoriesPO.setApprover(creater);
			accessoriesPO.setApproverTime(DateUtil.getDateToTimestamp(new Date()));

			accessoriesDao.update(accessoriesPO);

			accessoriesPOs.add(accessoriesPO);
		}

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_AS_INT, currentDate, company);
		String no = String.format("%sAS%s%s", companyPO.getShortname(), currentDate, FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		ManifestPO manifestPO = new ManifestPO().init(no, ManifestPO.TYPE_AS_INT, creater, ManifestPO.STATUS_CONFIRM_INT, "", "", null, company);

		manifestDao.save(manifestPO);

		ManifestItemPO manifestItemPO;

		for (AccessoriesItemVO accessoriesItemVO : accessoriesItemVOs) {

			long gid = accessoriesItemVO.getGoods().getGid();
			long cid = accessoriesItemVO.getColor().getCid();
			long fid = accessoriesItemVO.getFormat().getFid();

			float outprice = accessoriesItemVO.getOutprice();
			float num = accessoriesItemVO.getNum();

			StorehousePO outStorehousePO = goodsStorehouseStockService.outstorehouse(gid, cid, fid, accessoriesItemVO.getStorehouse().getShid(), num);

			manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), null, null, accessoriesItemVO.getAiid(), null, gid, cid, fid, ManifestPO.TYPE_AS_INT, 0, outprice, num, null, outStorehousePO);

			manifestItemDao.save(manifestItemPO);
		}

		for (AccessoriesPO accessories : accessoriesPOs) {
			accessoriesManifestDao.save(new AccessoriesManifestPO(accessories, manifestPO));
		}

		return 0;
	}

	@Override
	public int addManifestForAR(List<AccessoriesVO> accessoriesVOs, List<AccessoriesItemVO> accessoriesItemVOs, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		if (accessoriesVOs == null || accessoriesVOs.size() <= 0) {
			throw new FLException(260023, "辅料单不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		List<AccessoriesPO> accessoriesPOs = new ArrayList<AccessoriesPO>();

		AccessoriesPO accessoriesPO;
		for (AccessoriesVO accessoriesVO : accessoriesVOs) {

			accessoriesPO = accessoriesDao.get(accessoriesVO.getAid());

			if (accessoriesPO.getStatus() != AccessoriesPO.STATUS_BATCHOUT_INT) {
				throw new FLException(260024, "辅料单状态不可操作");
			}

			accessoriesPOs.add(accessoriesPO);
		}

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_AS_INT, currentDate, company);
		String no = String.format("%sAR%s%s", companyPO.getShortname(), currentDate, FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		ManifestPO manifestPO = new ManifestPO().init(no, ManifestPO.TYPE_AR_INT, creater, ManifestPO.STATUS_CONFIRM_INT, "", "", null, company);

		manifestDao.save(manifestPO);

		ManifestItemPO manifestItemPO;

		for (AccessoriesItemVO accessoriesItemVO : accessoriesItemVOs) {
			
			AccessoriesItemPO accessoriesItemPO = accessoriesItemDao.get(accessoriesItemVO.getAiid());
			
			long gid = accessoriesItemVO.getGoods().getGid();
			long cid = accessoriesItemVO.getColor().getCid();
			long fid = accessoriesItemVO.getFormat().getFid();

			float num = accessoriesItemVO.getNum();
			
			if (accessoriesItemPO.getSurplus() < num) {
				throw new FLException(260051, "辅料项数量不足");
			} else {
				accessoriesItemPO.setSurplus(Arith.sub(accessoriesItemPO.getSurplus(), num));
			}

			StorehousePO inStorehousePO = goodsStorehouseStockService.instorehouse(gid, cid, fid, accessoriesItemVO.getStorehouse().getShid(), num);

			manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), null, null, accessoriesItemVO.getAiid(), null, gid, cid, fid, ManifestPO.TYPE_AR_INT, 0, 0, num, inStorehousePO, null);

			manifestItemDao.save(manifestItemPO);
		}

		for (AccessoriesPO accessories : accessoriesPOs) {
			accessoriesManifestDao.save(new AccessoriesManifestPO(accessories, manifestPO));
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addManifestForPS(List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PS_INT, currentDate, company);
		String no = String.format("%sPS%s%s", companyPO.getShortname(), currentDate, FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		ManifestPO manifestPO = new ManifestPO().init(no, ManifestPO.TYPE_PS_INT, creater, ManifestPO.STATUS_CONFIRM_INT, "", "", null, company);

		manifestDao.save(manifestPO);

		ManifestItemPO manifestItemPO;

		for (ManifestItemVO manifestItemVO : manifestItemVOs) {

			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();

			float inprice = manifestItemVO.getInprice();
			float outprice = manifestItemVO.getOutprice();
			float num = manifestItemVO.getNum();

			if (manifestItemVO.getInstorehouse() != null) {
				StorehousePO inStorehousePO = goodsStorehouseStockService.instorehouse(gid, cid, fid, manifestItemVO.getInstorehouse().getShid(), num);
				manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), null, null, null, null, gid, cid, fid, ManifestPO.TYPE_PS_INT, inprice, outprice, num, inStorehousePO, null);

				manifestItemDao.save(manifestItemPO);
			} else if (manifestItemVO.getOutstorehouse() != null) {
				StorehousePO outStorehousePO = goodsStorehouseStockService.outstorehouse(gid, cid, fid, manifestItemVO.getOutstorehouse().getShid(), num);
				manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), null, null, null, null, gid, cid, fid, ManifestPO.TYPE_PS_INT, inprice, outprice, num, null, outStorehousePO);

				manifestItemDao.save(manifestItemPO);
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addManifestForPM(List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PM_INT, currentDate, company);
		String no = String.format("%sPM%s%s", companyPO.getShortname(), currentDate, FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		ManifestPO manifestPO = new ManifestPO().init(no, ManifestPO.TYPE_PM_INT, creater, ManifestPO.STATUS_CONFIRM_INT, "", "", null, company);

		manifestDao.save(manifestPO);

		ManifestItemPO manifestItemPO;

		for (ManifestItemVO manifestItemVO : manifestItemVOs) {

			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();

			float inprice = manifestItemVO.getInprice();
			float outprice = manifestItemVO.getOutprice();
			float num = manifestItemVO.getNum();

			if (manifestItemVO.getInstorehouse() != null) {
				StorehousePO inStorehousePO = goodsStorehouseStockService.instorehouse(gid, cid, fid, manifestItemVO.getInstorehouse().getShid(), num);
				manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), null, null, null, null, gid, cid, fid, ManifestPO.TYPE_PM_INT, inprice, outprice, num, inStorehousePO, null);

				manifestItemDao.save(manifestItemPO);
			} else if (manifestItemVO.getOutstorehouse() != null) {
				StorehousePO outStorehousePO = goodsStorehouseStockService.outstorehouse(gid, cid, fid, manifestItemVO.getOutstorehouse().getShid(), num);
				manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), null, null, null, null, gid, cid, fid, ManifestPO.TYPE_PM_INT, inprice, outprice, num, null, outStorehousePO);

				manifestItemDao.save(manifestItemPO);
			}
		}

		return 0;
	}

	@Override
	public int addManifestForCP(List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_CP_INT, currentDate, company);
		String no = String.format("%sCP%s%s", companyPO.getShortname(), currentDate, FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		ManifestPO manifestPO = new ManifestPO().init(no, ManifestPO.TYPE_CP_INT, creater, ManifestPO.STATUS_CONFIRM_INT, "", "", null, company);

		manifestDao.save(manifestPO);

		ManifestItemPO manifestItemPO;

		for (ManifestItemVO manifestItemVO : manifestItemVOs) {

			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();

			float inprice = manifestItemVO.getInprice();
			float num = manifestItemVO.getNum();

			StorehousePO inStorehousePO = goodsStorehouseStockService.instorehouse(gid, cid, fid, manifestItemVO.getInstorehouse().getShid(), num);
			manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), null, null, null, null, gid, cid, fid, ManifestPO.TYPE_CP_INT, inprice, 0, num, inStorehousePO, null);

			manifestItemDao.save(manifestItemPO);
		}
		
		return 0;
	}

	@Override
	public int addManifestForCL(List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_CL_INT, currentDate, company);
		String no = String.format("%sCL%s%s", companyPO.getShortname(), currentDate, FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		ManifestPO manifestPO = new ManifestPO().init(no, ManifestPO.TYPE_CL_INT, creater, ManifestPO.STATUS_CONFIRM_INT, "", "", null, company);

		manifestDao.save(manifestPO);

		ManifestItemPO manifestItemPO;

		for (ManifestItemVO manifestItemVO : manifestItemVOs) {

			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();

			float outprice = manifestItemVO.getOutprice();
			float num = manifestItemVO.getNum();

			StorehousePO outStorehousePO = goodsStorehouseStockService.outstorehouse(gid, cid, fid, manifestItemVO.getOutstorehouse().getShid(), num);
			manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), null, null, null, null, gid, cid, fid, ManifestPO.TYPE_CL_INT, 0, outprice, num, null, outStorehousePO);

			manifestItemDao.save(manifestItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateManifest(ManifestVO manifestVO) throws FLException {

		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());

		if (manifestPO == null) {
			throw new FLException(260009, "货单不存在");
		}

		if (manifestPO.getStatus() != ManifestPO.STATUS_INIT_INT) {
			throw new FLException(260027, "货单状态不可操作");
		}

		manifestPO.setManifestTime(manifestVO.getManifestTime());
		manifestPO.setComment(manifestVO.getComment());
		manifestPO.setAttachment(manifestVO.getAttachment());

		manifestDao.update(manifestPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmManifest(ManifestVO manifestVO) throws FLException {

		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());

		if (manifestPO == null) {
			throw new FLException(260009, "货单不存在");
		}

		if (manifestPO.getStatus() != ManifestPO.STATUS_INIT_INT) {
			throw new FLException(260027, "货单状态不可操作");
		}

		manifestPO.setStatus(ManifestPO.STATUS_CONFIRM_INT);

		manifestDao.update(manifestPO);

		return 0;
	}

}
