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
import com.fanglin.inventory.dao.AssisOrderDao;
import com.fanglin.inventory.dao.ManifestDao;
import com.fanglin.inventory.dao.ManifestItemDao;
import com.fanglin.inventory.dao.PurchaseDao;
import com.fanglin.inventory.po.AssisOrderPO;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.ManifestItemPO;
import com.fanglin.inventory.po.ManifestPO;
import com.fanglin.inventory.po.PurchasePO;
import com.fanglin.inventory.service.GoodsStorehouseStockService;
import com.fanglin.inventory.service.ManifestService;
import com.fanglin.inventory.service.PurchaseAmountService;
import com.fanglin.inventory.service.StorehouseStockService;
import com.fanglin.inventory.vo.ManifestItemVO;
import com.fanglin.inventory.vo.ManifestVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("manifestService")
@Transactional(readOnly=true)
public class ManifestServiceImpl implements ManifestService {
	
	@Autowired
	private ManifestDao manifestDao;
	
	@Autowired
	private ManifestItemDao manifestItemDao;
	
	@Autowired
	private PurchaseDao purchaseDao;
	
	@Autowired
	private AssisOrderDao assisOrderDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private GoodsStorehouseStockService goodsStorehouseStockService;
	
	@Autowired
	private StorehouseStockService storehouseStockService;
	
	@Autowired
	private PurchaseAmountService purchaseAmountService;
	
	@Autowired
	private CountingService countingService;
	
	@Override
	public void pageManifest(Paging paging, List<Filter> filters) {
		
		List<ManifestPO> manifestPOs = manifestDao.pageManifest(paging, filters);
		List<ManifestVO> manifestVOs = new ArrayList<ManifestVO>();
		
		ManifestVO manifestVO;
		
		for(ManifestPO manifestPO: manifestPOs){
			manifestVO = new ManifestVO(new UserVO());
			
			BeanUtil.copyProperties(manifestPO, manifestVO, Arrays.asList("createUser","quoteManifest"));
			manifestVO.getCreateUser().setBaseInfo(manifestPO.getCreateUser());
			
			manifestVOs.add(manifestVO);
		}

		paging.setData(manifestVOs);
	}

	@Override
	public ManifestVO queryManifestByMId(ManifestVO manifestVO) {
		
		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());
		
		manifestVO = new ManifestVO(new UserVO());
		
		BeanUtil.copyProperties(manifestPO, manifestVO, Arrays.asList("createUser"));
		manifestVO.getCreateUser().setBaseInfo(manifestPO.getCreateUser());
		
		return manifestVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForCG(ManifestVO manifestVO,List<ManifestItemVO> manifestItemVOs, String userId) throws FLException {
		
		if(manifestItemVOs == null || manifestItemVOs.size() < 0){
			throw new FLException(260007,"货单无商品信息");
		}
		
		float total = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "CG";
		String comment = "";
		
		UserPO userPO = userDao.get(userId);
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_CG_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		String manifestId = String.valueOf(word) + FormatUtil.fillZero(count, "00000000");
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		BeanUtil.copyProperties(manifestVO, manifestPO, Arrays.asList("createUser"));
		
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setCreateUser(userPO);
		
		manifestDao.save(manifestPO);
		
		ManifestItemPO manifestItemPO;
		
		for(ManifestItemVO manifestItemVO: manifestItemVOs){
			manifestItemPO = new ManifestItemPO(new GoodsPO(),new ColorPO(),new FormatPO());
			
			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();
			float num = manifestItemVO.getNum();
			comment = manifestItemVO.getComment();
			
			BeanUtil.copyProperties(manifestItemVO, manifestItemPO, Arrays.asList("goods","color","format","instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(manifestItemVO.getGoods(), manifestItemPO.getGoods());
			BeanUtil.copyProperties(manifestItemVO.getColor(), manifestItemPO.getColor());
			BeanUtil.copyProperties(manifestItemVO.getFormat(), manifestItemPO.getFormat());
			
			if(manifestItemVO.getInstorehouse() != null){
				
				long ishId = manifestItemVO.getInstorehouse().getShId();
				
				manifestItemPO.setInstorehouse(goodsStorehouseStockService.instorehouse(gid,cid, fid,ishId, num));
				storehouseStockService.updateStorehouseStock(ishId, month, num);
				
				total = Arith.add(total, manifestItemPO.getPurchasePrice());
			}
			
			manifestItemPO.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItemPO);
		}
		
		manifestPO.setTotal(total);
		manifestPO.setComment(comment);
		
		purchaseAmountService.updatePurchaseAmount(month, total);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForXG(ManifestVO manifestVO,List<ManifestItemVO> manifestItemVOs, String userId) throws FLException {
		if(manifestItemVOs == null || manifestItemVOs.size() < 0){
			throw new FLException(260007,"货单无商品信息");
		}
		
		float total = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "XG";
		String comment = "";
		
		UserPO userPO = userDao.get(userId);
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_XG_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		String manifestId = String.valueOf(word) + FormatUtil.fillZero(count, "00000000");
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		BeanUtil.copyProperties(manifestVO, manifestPO, Arrays.asList("createUser"));
		
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setCreateUser(userPO);
		
		manifestDao.save(manifestPO);
		
		ManifestItemPO manifestItemPO;
		
		for(ManifestItemVO manifestItemVO: manifestItemVOs){
			manifestItemPO = new ManifestItemPO(new GoodsPO(),new ColorPO(),new FormatPO());
			
			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();
			float num = manifestItemVO.getNum();
			comment = manifestItemVO.getComment();
			
			BeanUtil.copyProperties(manifestItemVO, manifestItemPO, Arrays.asList("goods","color","format","instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(manifestItemVO.getGoods(), manifestItemPO.getGoods());
			BeanUtil.copyProperties(manifestItemVO.getColor(), manifestItemPO.getColor());
			BeanUtil.copyProperties(manifestItemVO.getFormat(), manifestItemPO.getFormat());
			
			if(manifestItemVO.getOutstorehouse() != null){
				
				long oshId = manifestItemVO.getOutstorehouse().getShId();
				
				manifestItemPO.setOutstorehouse(goodsStorehouseStockService.outstorehouse(gid,cid,fid, oshId, num));
				storehouseStockService.updateStorehouseStock(oshId, month, -num);
				
				total = Arith.sub(total, manifestItemPO.getPurchasePrice());
			}
			
			manifestItemPO.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItemPO);
		}
		
		manifestPO.setTotal(total);
		manifestPO.setComment(comment);
		
		purchaseAmountService.updatePurchaseAmount(month, total);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForCR(ManifestVO manifestVO,List<ManifestItemVO> manifestItemVOs, String userId) throws FLException {

		if(manifestItemVOs == null || manifestItemVOs.size() <= 0){
			throw new FLException(260007, "货单无商品信息");
		}
		
		short status = manifestVO.getStatus();
		
		if(status != 1){
			throw new FLException(260027, "货单状态不可操作");
		}
		
		ManifestItemPO manifestItemPO;
		
		for(ManifestItemVO manifestItemVO : manifestItemVOs){
			manifestItemPO = manifestItemDao.get(manifestItemVO.getMiId());
			float numPO = manifestItemPO.getNum();
			float numVO = manifestItemVO.getNum();
			if(numVO > numPO){
				throw new FLException(260026, "货单项数量不符");
			}
			manifestItemPO.setNum(Arith.sub(numPO, numVO));
		}
		
		float total = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "CR";
		String comment = "";
		
		UserPO userPO = userDao.get(userId);
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_CR_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		String manifestId = String.valueOf(word) + FormatUtil.fillZero(count, "00000000");
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		BeanUtil.copyProperties(manifestVO, manifestPO, Arrays.asList("createUser","quoteManifest"));
		BeanUtil.copyProperties(manifestVO.getQuoteManifest(), manifestPO.getQuoteManifest(), Arrays.asList("createUser"));
		
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setManifestTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setCreateUser(userPO);
		manifestPO.setQuoteManifest(manifestDao.get(manifestVO.getMid()));
		manifestPO.setStatus(ManifestPO.STATUS_DISABLE_INT);
		
		manifestDao.save(manifestPO);
		
		for(ManifestItemVO manifestItemVO: manifestItemVOs){
			manifestItemPO = new ManifestItemPO(new GoodsPO(),new ColorPO(),new FormatPO());
			
			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();
			float num = manifestItemVO.getNum();
			comment = manifestItemVO.getComment();
			
			BeanUtil.copyProperties(manifestItemVO, manifestItemPO, Arrays.asList("goods","color","format","instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(manifestItemVO.getGoods(), manifestItemPO.getGoods());
			BeanUtil.copyProperties(manifestItemVO.getColor(), manifestItemPO.getColor());
			BeanUtil.copyProperties(manifestItemVO.getFormat(), manifestItemPO.getFormat());
			
			if(manifestItemVO.getOutstorehouse() != null){
				
				long oshId = manifestItemVO.getOutstorehouse().getShId();
				
				manifestItemPO.setOutstorehouse(goodsStorehouseStockService.outstorehouse(gid,cid,fid, oshId, num));
				storehouseStockService.updateStorehouseStock(oshId, month, -num);
				
				total = Arith.sub(total, manifestItemPO.getPurchasePrice());
			}
			
			manifestItemPO.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItemPO);
		}
		
		manifestPO.setTotal(total);
		manifestPO.setComment(comment);
		
		purchaseAmountService.updatePurchaseAmount(month, total);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForXB(ManifestVO manifestVO,List<ManifestItemVO> manifestItemVOs, String userId) throws FLException {
		
		if(manifestItemVOs == null || manifestItemVOs.size() <= 0){
			throw new FLException(260007, "货单无商品信息");
		}
		
		short status = manifestVO.getStatus();
		
		if(status != 1){
			throw new FLException(260027, "货单状态不可操作");
		}
		
		ManifestItemPO manifestItemPO;
		
		for(ManifestItemVO manifestItemVO : manifestItemVOs){
			manifestItemPO = manifestItemDao.get(manifestItemVO.getMiId());
			float numPO = manifestItemPO.getNum();
			float numVO = manifestItemVO.getNum();
			if(numVO > numPO){
				throw new FLException(260026, "货单项数量不符");
			}
			manifestItemPO.setNum(Arith.sub(numPO, numVO));
		}
		
		float total = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "XB";
		String comment = "";
		
		UserPO userPO = userDao.get(userId);
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_XB_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		String manifestId = String.valueOf(word) + FormatUtil.fillZero(count, "00000000");
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		BeanUtil.copyProperties(manifestVO, manifestPO, Arrays.asList("createUser","quoteManifest"));
		BeanUtil.copyProperties(manifestVO.getQuoteManifest(), manifestPO.getQuoteManifest(), Arrays.asList("createUser"));
		
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setManifestTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setCreateUser(userPO);
		manifestPO.setQuoteManifest(manifestDao.get(manifestVO.getMid()));
		manifestPO.setStatus(ManifestPO.STATUS_DISABLE_INT);
		
		manifestDao.save(manifestPO);
		
		for(ManifestItemVO manifestItemVO: manifestItemVOs){
			manifestItemPO = new ManifestItemPO(new GoodsPO(),new ColorPO(),new FormatPO());
			
			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();
			float num = manifestItemVO.getNum();
			comment = manifestItemVO.getComment();
			
			BeanUtil.copyProperties(manifestItemVO, manifestItemPO, Arrays.asList("goods","color","format","instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(manifestItemVO.getGoods(), manifestItemPO.getGoods());
			BeanUtil.copyProperties(manifestItemVO.getColor(), manifestItemPO.getColor());
			BeanUtil.copyProperties(manifestItemVO.getFormat(), manifestItemPO.getFormat());
			
			if(manifestItemVO.getInstorehouse() != null){
				
				long ishId = manifestItemVO.getInstorehouse().getShId();
				
				manifestItemPO.setInstorehouse(goodsStorehouseStockService.instorehouse(gid,cid, fid,ishId, num));
				storehouseStockService.updateStorehouseStock(ishId, month, num);
				
				total = Arith.add(total, manifestItemPO.getPurchasePrice());
			}
			
			manifestItemPO.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItemPO);
		}
		
		manifestPO.setTotal(total);
		manifestPO.setComment(comment);
		
		purchaseAmountService.updatePurchaseAmount(month, total);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForDB(ManifestVO manifestVO,List<ManifestItemVO> manifestItemVOs, String userId) throws FLException {
		
		if(manifestItemVOs == null || manifestItemVOs.size() <= 0){
			throw new FLException(260007, "货单无商品信息");
		}
		
		float total = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "DB";
		String comment = "";
		
		UserPO userPO = userDao.get(userId);
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_DB_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		String manifestId = String.valueOf(word) + FormatUtil.fillZero(count, "00000000");
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		BeanUtil.copyProperties(manifestVO, manifestPO, Arrays.asList("createUser"));
		
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setManifestTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setCreateUser(userPO);
		manifestPO.setStatus(ManifestPO.STATUS_DISABLE_INT);
		
		manifestDao.save(manifestPO);
		
		ManifestItemPO manifestItemPO;
		
		for(ManifestItemVO manifestItemVO: manifestItemVOs){
			manifestItemPO = new ManifestItemPO(new GoodsPO(),new ColorPO(),new FormatPO());
			
			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();
			float num = manifestItemVO.getNum();
			comment = manifestItemVO.getComment();
			
			BeanUtil.copyProperties(manifestItemVO, manifestItemPO, Arrays.asList("goods","color","format","instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(manifestItemVO.getGoods(), manifestItemPO.getGoods());
			BeanUtil.copyProperties(manifestItemVO.getColor(), manifestItemPO.getColor());
			BeanUtil.copyProperties(manifestItemVO.getFormat(), manifestItemPO.getFormat());
			
			
			if(manifestItemVO.getInstorehouse() != null){
				
				long ishId = manifestItemVO.getInstorehouse().getShId();
				
				manifestItemPO.setInstorehouse(goodsStorehouseStockService.instorehouse(gid,cid, fid,ishId, num));
				storehouseStockService.updateStorehouseStock(ishId, month, num);
				
				total = Arith.add(total, manifestItemPO.getPurchasePrice());
			}
			
			if(manifestItemVO.getOutstorehouse() != null){
				
				long oshId = manifestItemVO.getOutstorehouse().getShId();
				
				manifestItemPO.setOutstorehouse(goodsStorehouseStockService.outstorehouse(gid,cid,fid, oshId, num));
				storehouseStockService.updateStorehouseStock(oshId, month, -num);
				
				total = Arith.sub(total, manifestItemPO.getPurchasePrice());
			}
			
			manifestItemPO.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItemPO);
		}
		
		manifestPO.setTotal(total);
		manifestPO.setComment(comment);
		
		purchaseAmountService.updatePurchaseAmount(month, total);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForPU(ManifestVO manifestVO, List<Long> pids, List<ManifestItemVO> manifestItemVOs, String uid) throws FLException{
		
		// type 1: 进货 , 2: 进退 , 3: 出货 , 4: 出返 , 5: 调拨 , 6:采购 , 7:辅类
		
		if(pids == null || pids.size() <= 0){
			throw new FLException(260017, "采购单不存在");
		}
		float total = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "PU";
		String comment = "";
		
		UserPO userPO = userDao.get(uid);
		
		//PO作为编号前缀 , 之后由8位数字组成
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PU_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		String manifestId = String.valueOf(word) + FormatUtil.fillZero(count, "00000000");
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		BeanUtil.copyProperties(manifestVO, manifestPO, Arrays.asList("createUser"));	
		
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setManifestTime(DateUtil.getDateToTimestamp(new Date()));
		
		manifestPO.setCreateUser(userPO);
		manifestPO.setTotal(ManifestPO.COLUMN_TOTAL_STR);
		manifestPO.setType(ManifestPO.COLUMN_TYPE_STR);
		manifestPO.setStatus(ManifestPO.COLUMN_CONFIRMEDSTATUS_STR);	
		
		manifestDao.save(manifestPO);
		
		ManifestItemPO manifestItemPO;
		for(ManifestItemVO manifestItemVO: manifestItemVOs){
			manifestItemPO = new ManifestItemPO(new GoodsPO(),new ColorPO(),new FormatPO());
			
			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();
			float num = manifestItemVO.getNum();
			
			comment = manifestItemVO.getComment();
			
			BeanUtil.copyProperties(manifestItemVO, manifestItemPO, Arrays.asList("goods","color","format","instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(manifestItemVO.getGoods(), manifestItemPO.getGoods(),Arrays.asList("workType"));
			BeanUtil.copyProperties(manifestItemVO.getColor(), manifestItemPO.getColor());
			BeanUtil.copyProperties(manifestItemVO.getFormat(), manifestItemPO.getFormat());
			
			if(manifestItemVO.getInstorehouse() != null){
				
				long ishId = manifestItemVO.getInstorehouse().getShId();
				
				manifestItemPO.setInstorehouse(goodsStorehouseStockService.instorehouse(gid,cid, fid,ishId, num));
				storehouseStockService.updateStorehouseStock(ishId, month, num);
				
				total = Arith.add(total, manifestItemPO.getPurchasePrice());
			}			
			
			manifestItemPO.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItemPO);
			
		}
		
		manifestPO.setComment(comment);
		manifestPO.setTotal(total);
		
		purchaseAmountService.updatePurchaseAmount(month, total);
		
		PurchasePO purchasePO;
		for(Long pid :pids){
			purchasePO = purchaseDao.get(pid);
			purchasePO.setStatus(PurchasePO.COLUMN_SECTIONSTATUS_STR);
			purchaseDao.save(purchasePO);
		}
		
		return 0;
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForAS(ManifestVO manifestVO,List<ManifestItemVO> manifestItemVOs,List<Long> aoids, String userId)throws FLException {
		
		// type 1: 进货 , 2: 进退 , 3: 出货 , 4: 出返 , 5: 调拨 , 6:采购 , 7:辅类
		
		if(aoids == null || aoids.size() <= 0){
			throw new FLException(260023, "辅料单不存在");
		}
		
		float total = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "AS";
		String comment = "";
		
		UserPO userPO = userDao.get(userId);
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_AS_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		String manifestId = String.valueOf(word) + FormatUtil.fillZero(count, "00000000");
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		BeanUtil.copyProperties(manifestVO, manifestPO, Arrays.asList("createUser"));
		
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setManifestTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setCreateUser(userPO);
		manifestPO.setStatus(ManifestPO.STATUS_DISABLE_INT);
		
		manifestDao.save(manifestPO);
		
		ManifestItemPO manifestItemPO;
		for(ManifestItemVO manifestItemVO: manifestItemVOs){
			manifestItemPO = new ManifestItemPO(new GoodsPO(),new ColorPO(),new FormatPO());
			
			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();
			float num = manifestItemVO.getNum();
			comment = manifestItemVO.getComment();
			
			BeanUtil.copyProperties(manifestItemVO, manifestItemPO, Arrays.asList("goods","color","format","instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(manifestItemVO.getGoods(), manifestItemPO.getGoods());
			BeanUtil.copyProperties(manifestItemVO.getColor(), manifestItemPO.getColor());
			BeanUtil.copyProperties(manifestItemVO.getFormat(), manifestItemPO.getFormat());
			
			if(manifestItemVO.getOutstorehouse() != null){
				
				long oshId = manifestItemVO.getOutstorehouse().getShId();
				
				manifestItemPO.setOutstorehouse(goodsStorehouseStockService.outstorehouse(gid,cid,fid, oshId, num));
				storehouseStockService.updateStorehouseStock(oshId, month, -num);
				
				total = Arith.sub(total, manifestItemPO.getPurchasePrice());
			}
			
			manifestItemPO.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItemPO);
		}
		
		
		manifestPO.setTotal(total);
		manifestPO.setComment(comment);
		
		purchaseAmountService.updatePurchaseAmount(month, total);
		
		AssisOrderPO assisOrderPO;
		for(Long aoid : aoids){
			
			assisOrderPO = assisOrderDao.get(aoid);
			
			assisOrderPO.setStatus(AssisOrderPO.STATUS_DISABLE_INT);
			assisOrderPO.setApprover(userPO);
			assisOrderPO.setApproverTime(DateUtil.getDateToTimestamp(new Date()));
			
			assisOrderDao.save(assisOrderPO);
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateManifest(ManifestVO manifestVO) throws FLException {
		
		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());
		
		if(manifestPO == null){
			throw new FLException(260009, "货单不存在");
		}
		
		manifestPO.setManifestTime(manifestVO.getManifestTime());
		manifestPO.setComment(manifestVO.getComment());
		manifestPO.setAttachment(manifestVO.getAttachment());
		
		manifestDao.update(manifestPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateManifestForStatus(ManifestVO manifestVO) throws FLException {
		
		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());
		
		if(manifestPO == null){
			throw new FLException(260009, "货单不存在");
		}
		
		manifestPO.setStatus(manifestVO.getStatus());
		
		manifestDao.update(manifestPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int confirmManifest(ManifestVO manifestVO) throws FLException {
		
		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());
		
		if(manifestPO == null){
			throw new FLException(260009, "货单不存在");
		}
		
		short status = manifestPO.getStatus();
		
		if(status != 0){
			throw new FLException(260027, "货单状态不可操作");
		}
		
		manifestPO.setStatus(ManifestPO.STATUS_DISABLE_INT);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteManifest(ManifestVO manifestVO) throws FLException {
		
		long mid = manifestVO.getMid();
		
		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());
		
		if(manifestPO == null){
			throw new FLException(260009, "货单不存在");
		}
		
		List<ManifestItemPO> manifestItemPOs = manifestItemDao.queryManifestItemByMId(mid);
		
		for(ManifestItemPO manifestItemPO: manifestItemPOs){
			
			if(manifestItemPO.getInstorehouse() != null){
				goodsStorehouseStockService.outstorehouse(manifestItemPO.getGoods().getGid(),manifestItemPO.getColor().getCid(),manifestItemPO.getFormat().getFid(), manifestItemPO.getInstorehouse().getShId(), manifestItemPO.getNum());
			}
			
			if(manifestItemPO.getOutstorehouse() != null){
				goodsStorehouseStockService.instorehouse(manifestItemPO.getGoods().getGid(),manifestItemPO.getColor().getCid(),manifestItemPO.getFormat().getFid(), manifestItemPO.getOutstorehouse().getShId(), manifestItemPO.getNum());
			}
			
			manifestItemDao.delete(manifestItemPO);
		}
		
		manifestDao.delete(manifestPO);
		
		return 0;
	}

}
