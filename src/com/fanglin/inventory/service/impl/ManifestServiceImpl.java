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
import com.fanglin.inventory.dao.AccessoriesManifestDao;
import com.fanglin.inventory.dao.AccessoriesDao;
import com.fanglin.inventory.dao.ManifestDao;
import com.fanglin.inventory.dao.ManifestItemDao;
import com.fanglin.inventory.dao.PurchaseDao;
import com.fanglin.inventory.dao.PurchaseItemDao;
import com.fanglin.inventory.dao.PurchaseManifestDao;
import com.fanglin.inventory.dao.StorehouseDao;
import com.fanglin.inventory.po.AccessoriesPO;
import com.fanglin.inventory.po.AccessoriesManifestPO;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.ManifestItemPO;
import com.fanglin.inventory.po.ManifestPO;
import com.fanglin.inventory.po.PurchaseItemPO;
import com.fanglin.inventory.po.PurchaseManifestPO;
import com.fanglin.inventory.po.PurchasePO;
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.inventory.service.GoodsStorehouseStockService;
import com.fanglin.inventory.service.ManifestService;
import com.fanglin.inventory.service.StorehouseStockService;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.inventory.vo.ManifestItemVO;
import com.fanglin.inventory.vo.ManifestVO;
import com.fanglin.inventory.vo.PurchaseItemVO;
import com.fanglin.inventory.vo.PurchaseVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesDao;
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
@Transactional(readOnly=true)
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
	private UserDao userDao;
	
	@Autowired
	private AccessoriesManifestDao accessoriesManifestDao;
	
	@Autowired
	private PurchaseManifestDao purchaseManifestDao;
	
	@Autowired
	private GoodsStorehouseStockService goodsStorehouseStockService;
	
	@Autowired
	private StorehouseStockService storehouseStockService;
	
	@Autowired
	private CountingService countingService;
	
	@Autowired 
	private StorehouseDao storehouseDao;
	
	@Autowired
	private SalesDao salesDao;
	
	@Autowired
	private SalesManifestDao salesManifestDao;
	
	
	@Override
	public void pageManifest(Paging paging, List<Filter> filters,int company) {
		
		List<ManifestPO> manifestPOs = manifestDao.pageManifest(paging, filters,company);
		List<ManifestVO> manifestVOs = new ArrayList<ManifestVO>();
		
		ManifestVO manifestVO;
		
		for(ManifestPO manifestPO: manifestPOs){
			manifestVO = new ManifestVO(new UserBaseVO());
			
			BeanUtil.copyProperties(manifestPO, manifestVO, Arrays.asList("createUser","quoteManifest"));
			manifestVO.getCreateUser().setBaseInfo(manifestPO.getCreateUser());
			
			manifestVOs.add(manifestVO);
		}

		paging.setData(manifestVOs);
	}

	@Override
	public ManifestVO queryManifestByMid(ManifestVO manifestVO) {
		
		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());
		
		manifestVO = new ManifestVO(new UserBaseVO());
		
		BeanUtil.copyProperties(manifestPO, manifestVO, Arrays.asList("createUser","quoteManifest"));
		manifestVO.getCreateUser().setBaseInfo(manifestPO.getCreateUser());
		
		return manifestVO;
	}
	
	@Override
	public List<ManifestVO> queryManifestForPUByPids(List<Long> pids) {
		
		List<ManifestVO> manifestVOs = new ArrayList<ManifestVO>();
		
		if(pids == null || pids.size()==0){
			return manifestVOs;
		}
		
		List<PurchaseManifestPO> purchaseManifestPOs = purchaseManifestDao.queryPurchaseManifestByPids(pids);
		
		
		
		for(PurchaseManifestPO purchaseManifestPO : purchaseManifestPOs){
			
			ManifestVO manifestVO = new ManifestVO(new UserBaseVO());
			
			BeanUtil.copyProperties(purchaseManifestPO.getManifest(), manifestVO, Arrays.asList("createUser","quoteManifest"));
			BeanUtil.copyProperties(purchaseManifestPO.getManifest().getCreateUser(), manifestVO.getCreateUser(), Arrays.asList("duty","dept"));
			
			manifestVOs.add(manifestVO);
		}
		
		return manifestVOs;
	}

	@Override
	public List<ManifestVO> queryManifestForXGBySid(SalesVO salesVO) {
		
		List<SalesManifestPO> salesManifestVOs = salesManifestDao.querySalesManifestBySid(salesVO.getSid());
		
		List<ManifestVO> manifestVOs = new ArrayList<ManifestVO>();
		
		for(SalesManifestPO salesManifestPO : salesManifestVOs){
			
			ManifestVO manifestVO = new ManifestVO(new UserBaseVO());
			
			BeanUtil.copyProperties(salesManifestPO.getManifest(), manifestVO, Arrays.asList("createUser","quoteManifest"));
			BeanUtil.copyProperties(salesManifestPO.getManifest().getCreateUser(), manifestVO.getCreateUser(), Arrays.asList("duty","dept"));
			
			manifestVOs.add(manifestVO);
		}
		
		return manifestVOs;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForCG(ManifestVO manifestVO,List<ManifestItemVO> manifestItemVOs, String userId,int company) throws FLException {
		
		CompanyPO companyPO = companyDao.get(company);
		
		if(companyPO == null){
			throw new FLException(230015, "公司不存在");
		}
		
		if(manifestItemVOs == null || manifestItemVOs.size() < 0){
			throw new FLException(260007,"货单无商品信息");
		}
		
		float total = 0f;
		float totals = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "CG";
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_CG_INT,currentDate, company);
		String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		String manifestId = companyPO.getShortname() + String.valueOf(word) + currentDate + endNo;
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		BeanUtil.copyProperties(manifestVO, manifestPO, Arrays.asList("createUser"));
		
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setCreateUser(userPO);
		manifestPO.setCompany(company);
		
		manifestDao.save(manifestPO);
		
		ManifestItemPO manifestItemPO;
		
		for(ManifestItemVO manifestItemVO: manifestItemVOs){
			manifestItemPO = new ManifestItemPO(new GoodsPO(),new ColorPO(),new FormatPO());
			
			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();
			float num = manifestItemVO.getNum();
			
			BeanUtil.copyProperties(manifestItemVO, manifestItemPO, Arrays.asList("goods","color","format","instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(manifestItemVO.getGoods(), manifestItemPO.getGoods());
			BeanUtil.copyProperties(manifestItemVO.getColor(), manifestItemPO.getColor());
			BeanUtil.copyProperties(manifestItemVO.getFormat(), manifestItemPO.getFormat());
			
			if(manifestItemVO.getInstorehouse() != null){
				
				long ishId = manifestItemVO.getInstorehouse().getShId();
				
				manifestItemPO.setInstorehouse(goodsStorehouseStockService.instorehouse(gid,cid, fid,ishId, num));
				
				storehouseStockService.updateStorehouseStock(ishId, month, num);
				
				float _total = Arith.add(total, manifestItemPO.getUnitPrice());
				
				totals = Arith.add(totals,Arith.mul(_total, num));
			}
			
			manifestItemPO.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItemPO);
		}
		
		manifestPO.setTotal(totals);
		manifestPO.setComment(manifestVO.getComment());
		
		manifestDao.update(manifestPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForXG(ManifestVO manifestVO,List<Long> sids, List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException {
		
		CompanyPO companyPO = companyDao.get(company);
		
		if(companyPO == null){
			throw new FLException(230015, "公司不存在");
		}
		
		if(manifestItemVOs == null || manifestItemVOs.size() < 0){
			throw new FLException(260007,"货单无商品信息");
		}
		
		float total = 0f;
		float totals = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "XG";
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_XG_INT,currentDate, company);
		String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		String manifestId = companyPO.getShortname() + String.valueOf(word) + currentDate + endNo;
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		BeanUtil.copyProperties(manifestVO, manifestPO, Arrays.asList("createUser"));
		
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setCreateUser(userPO);
		manifestPO.setCompany(company);
		
		manifestDao.save(manifestPO);
		
		ManifestItemPO manifestItemPO;
		
		for(ManifestItemVO manifestItemVO: manifestItemVOs){
			
			manifestItemPO = new ManifestItemPO(new GoodsPO(),new ColorPO(),new FormatPO());
			
			long gid = manifestItemVO.getGoods().getGid();
			long cid = manifestItemVO.getColor().getCid();
			long fid = manifestItemVO.getFormat().getFid();
			float num = manifestItemVO.getNum();
			
			BeanUtil.copyProperties(manifestItemVO, manifestItemPO, Arrays.asList("goods","color","format","instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(manifestItemVO.getGoods(), manifestItemPO.getGoods());
			BeanUtil.copyProperties(manifestItemVO.getColor(), manifestItemPO.getColor());
			BeanUtil.copyProperties(manifestItemVO.getFormat(), manifestItemPO.getFormat());
			
			if(manifestItemVO.getOutstorehouse() != null){
				
				long oshId = manifestItemVO.getOutstorehouse().getShId();
				
				manifestItemPO.setOutstorehouse(goodsStorehouseStockService.outstorehouse(gid,cid,fid, oshId, num));
				storehouseStockService.updateStorehouseStock(oshId, month, -num);
				
				float _total = Arith.sub(total, manifestItemPO.getUnitPrice());
				totals = Arith.add(totals,Arith.mul(_total, num));
			}
			
			manifestItemPO.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItemPO);
		}
		
		manifestPO.setTotal(totals);
		manifestPO.setComment(manifestVO.getComment());
		
		manifestDao.update(manifestPO);
		
		SalesPO salesPO;
		SalesManifestPO salesManifestPO;
		
		if(sids != null && sids.size()!=0){
			
			for(Long sid : sids){
				
				salesPO = salesDao.get(sid);
				
				salesManifestPO = new SalesManifestPO(salesPO, manifestPO);
				
				salesManifestDao.save(salesManifestPO);
				
			}
			
		}
		
		return 0;
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForCR(ManifestVO manifestVO,List<ManifestItemVO> manifestItemVOs, String userId,int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);
		
		if(companyPO == null){
			throw new FLException(230015, "公司不存在");
		}
		
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
		float totals = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "CR";
		String attachment = "";
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_CR_INT,currentDate, company);
		String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		String manifestId = companyPO.getShortname() + String.valueOf(word) + currentDate + endNo;
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		BeanUtil.copyProperties(manifestVO, manifestPO, Arrays.asList("createUser","quoteManifest"));
		BeanUtil.copyProperties(manifestVO.getQuoteManifest(), manifestPO.getQuoteManifest(), Arrays.asList("createUser"));
		
		manifestPO.setType(ManifestPO.TYPE_CR_INT);
		manifestPO.setAttachment(attachment);
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setManifestTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setCreateUser(userPO);
		manifestPO.setQuoteManifest(manifestDao.get(manifestVO.getMid()));
		manifestPO.setStatus(ManifestPO.STATUS_DISABLE_INT);
		manifestPO.setCompany(company);
		
		manifestDao.save(manifestPO);
		
		for(ManifestItemVO manifestItemVO: manifestItemVOs){
			
			manifestItemPO = manifestItemDao.get(manifestItemVO.getMiId());
			ManifestItemPO manifestItem = new ManifestItemPO(new GoodsPO(),new ColorPO(),new FormatPO());
			long gid = manifestItemPO.getGoods().getGid();
			long cid = manifestItemPO.getColor().getCid();
			long fid = manifestItemPO.getFormat().getFid();
			float num = manifestItemVO.getNum();
			
			BeanUtil.copyProperties(manifestItemPO,manifestItem, Arrays.asList("goods","color","format","instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(manifestItemPO.getGoods(), manifestItem.getGoods());
			BeanUtil.copyProperties(manifestItemPO.getColor(), manifestItem.getColor());
			BeanUtil.copyProperties(manifestItemPO.getFormat(), manifestItem.getFormat());
			
			if(manifestItemPO.getInstorehouse() != null){
				
				long oshId = manifestItemPO.getInstorehouse().getShId();
				
				manifestItem.setOutstorehouse(goodsStorehouseStockService.outstorehouse(gid,cid,fid, oshId, num));
				storehouseStockService.updateStorehouseStock(oshId, month, -num);
				
				float _total = Arith.sub(total, manifestItem.getUnitPrice());
				totals = Arith.add(totals, Arith.mul(_total, num));
			}
			
			manifestItem.setNum(num);
			manifestItem.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItem);
		}
		
		manifestPO.setTotal(totals);
		manifestPO.setComment(manifestVO.getComment());
		
		manifestDao.update(manifestPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForXB(ManifestVO manifestVO,List<ManifestItemVO> manifestItemVOs, String userId,int company) throws FLException {
		
		CompanyPO companyPO = companyDao.get(company);
		
		if(companyPO == null){
			throw new FLException(230015, "公司不存在");
		}
		
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
		float totals = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "XB";
		String attachment ="";
		String comment = "";
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_XB_INT,currentDate, company);
		String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		String manifestId = companyPO.getShortname() + String.valueOf(word) + currentDate + endNo;
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		BeanUtil.copyProperties(manifestVO, manifestPO, Arrays.asList("createUser","quoteManifest"));
		BeanUtil.copyProperties(manifestVO.getQuoteManifest(), manifestPO.getQuoteManifest(), Arrays.asList("createUser"));
		
		manifestPO.setType(ManifestPO.TYPE_XB_INT);
		manifestPO.setAttachment(attachment);
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setManifestTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setCreateUser(userPO);
		manifestPO.setQuoteManifest(manifestDao.get(manifestVO.getMid()));
		manifestPO.setStatus(ManifestPO.STATUS_DISABLE_INT);
		manifestPO.setCompany(company);
		
		manifestDao.save(manifestPO);
		
		for(ManifestItemVO manifestItemVO: manifestItemVOs){
			
			manifestItemPO = manifestItemDao.get(manifestItemVO.getMiId());
			
			ManifestItemPO manifestItem = new ManifestItemPO(new GoodsPO(),new ColorPO(),new FormatPO());
			
			long gid = manifestItemPO.getGoods().getGid();
			long cid = manifestItemPO.getColor().getCid();
			long fid = manifestItemPO.getFormat().getFid();
			float num = manifestItemVO.getNum();
			comment = manifestVO.getComment();
			
			BeanUtil.copyProperties(manifestItemPO, manifestItem, Arrays.asList("goods","color","format","instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(manifestItemPO.getGoods(), manifestItem.getGoods());
			BeanUtil.copyProperties(manifestItemPO.getColor(), manifestItem.getColor());
			BeanUtil.copyProperties(manifestItemPO.getFormat(), manifestItem.getFormat());
			
			if(manifestItemPO.getOutstorehouse() != null){
				
				long ishId = manifestItemPO.getOutstorehouse().getShId();
				manifestItem.setInstorehouse(goodsStorehouseStockService.instorehouse(gid,cid, fid,ishId, num));
				storehouseStockService.updateStorehouseStock(ishId, month, num);
				
				float _total = Arith.add(total, manifestItem.getUnitPrice());
				totals = Arith.add(totals,Arith.mul(_total, num));
			}
			
			manifestItem.setNum(num);
			manifestItem.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItem);
		}
		
		manifestPO.setTotal(totals);
		manifestPO.setComment(comment);
		
		manifestDao.update(manifestPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForPU(List<PurchaseVO> purchaseVOs,List<PurchaseItemVO> purchaseItemVOs,String uid,int company) throws FLException{
		
		// type 1: 进货 , 2: 进退 , 3: 出货 , 4: 出返 , 5: 调拨 , 6:采购 , 7:辅类
		
		CompanyPO companyPO = companyDao.get(company);
		
		if(companyPO == null){
			throw new FLException(230015, "公司不存在");
		}
		
		if(purchaseVOs == null || purchaseVOs.size() <= 0){
			throw new FLException(260017, "采购单不存在");
		}
		
		float total = 0f;
		float totals = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "PU";
		String comment = "";
		
		UserPO userPO = userDao.queryUserByUserId(uid);
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PU_INT,currentDate, company);
		String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		String manifestId = companyPO.getShortname() + String.valueOf(word) + currentDate + endNo;
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setManifestTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setAttachment("");
		manifestPO.setComment(comment);
		manifestPO.setCreateUser(userPO);
		manifestPO.setTotal(ManifestPO.COLUMN_TOTAL_STR);
		manifestPO.setType(ManifestPO.TYPE_PU_INT);
		manifestPO.setStatus(ManifestPO.COLUMN_CONFIRMEDSTATUS_STR);	
		manifestPO.setCompany(company);
		
		manifestDao.save(manifestPO);
		
		ManifestItemPO manifestItemPO;
		
		for(PurchaseItemVO purchaseItemVO : purchaseItemVOs){
			
			PurchaseItemPO purchaseItemPO = purchaseItemDao.get(purchaseItemVO.getPiId());
			
			purchaseItemPO.setSurplus(Arith.sub(purchaseItemPO.getSurplus(), purchaseItemVO.getNum()));
			
			long gid = purchaseItemPO.getGoods().getGid();
			long cid = purchaseItemPO.getColor().getCid();
			long fid = purchaseItemPO.getFormat().getFid();
			
			manifestItemPO = new ManifestItemPO(new GoodsPO(gid),new ColorPO(cid),new FormatPO(fid));
			manifestItemPO.setNum(purchaseItemVO.getNum());
			manifestItemPO.setSiid(purchaseItemPO.getSiid());
			manifestItemPO.setUnitPrice(purchaseItemPO.getUnitPrice());
			
			if(purchaseItemVO.getStorehouse() != null){
				
				long ishId = purchaseItemVO.getStorehouse().getShId();
				
				manifestItemPO.setInstorehouse(goodsStorehouseStockService.instorehouse(gid,cid, fid,ishId, purchaseItemVO.getNum()));
				storehouseStockService.updateStorehouseStock(ishId, month, purchaseItemVO.getNum());
				
				float _total = Arith.add(total, manifestItemPO.getUnitPrice());
				totals = Arith.add(totals,Arith.mul(_total, purchaseItemVO.getNum()));
			}	
			
			manifestItemPO.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItemPO);
			purchaseItemDao.update(purchaseItemPO);
			
		}
		
		manifestPO.setTotal(totals);
		
		manifestDao.update(manifestPO);
		
		PurchasePO purchasePO;
		PurchaseManifestPO purchaseManifestPO;
		
		for(PurchaseVO purchaseVO :purchaseVOs){
			
			purchasePO = purchaseDao.get(purchaseVO.getPid());
			
			purchasePO.setStatus(PurchasePO.COLUMN_SECTIONSTATUS_STR);
			
			purchaseDao.update(purchasePO);
			
			purchaseManifestPO = new PurchaseManifestPO(purchasePO,manifestPO);
			
			purchaseManifestDao.save(purchaseManifestPO);
			
		}
		
		return 0;
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForAS(List<AccessoriesVO> accessoriesVOs,List<AccessoriesItemVO> accessoriesItemVOs,String userId,int company)throws FLException {
		
		// type 1: 进货 , 2: 进退 , 3: 出货 , 4: 出返 , 5: 调拨 , 6:采购 , 7:辅类
		
		CompanyPO companyPO = companyDao.get(company);
		
		if(companyPO == null){
			throw new FLException(230015, "公司不存在");
		}
		
		if(accessoriesVOs == null || accessoriesVOs.size() <= 0){
			throw new FLException(260023, "辅料单不存在");
		}
		
		float total = 0f;
		float totals = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "AS";
		String comment = "";
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_AS_INT,currentDate, company);
		String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		String manifestId = companyPO.getShortname() + String.valueOf(word) + currentDate + endNo;
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		manifestPO.setAttachment("");
		manifestPO.setComment(comment);
		manifestPO.setCreateUser(userPO);
		manifestPO.setTotal(ManifestPO.COLUMN_TOTAL_STR);
		manifestPO.setType(ManifestPO.TYPE_AS_INT);
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setManifestTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setCreateUser(userPO);
		manifestPO.setStatus(ManifestPO.STATUS_DISABLE_INT);
		manifestPO.setCompany(company);
		
		manifestDao.save(manifestPO);
		
		ManifestItemPO manifestItemPO;
		for(AccessoriesItemVO accessoriesItemVO: accessoriesItemVOs){
			
			long gid = accessoriesItemVO.getGoods().getGid();
			long cid = accessoriesItemVO.getColor().getCid();
			long fid = accessoriesItemVO.getFormat().getFid();
			float num = accessoriesItemVO.getNum();
			
			manifestItemPO = new ManifestItemPO(new GoodsPO(gid),new ColorPO(cid),new FormatPO(fid));
			manifestItemPO.setNum(num);
			
			if(accessoriesItemVO.getStorehouse() != null){
				
				long oshId = accessoriesItemVO.getStorehouse().getShId();
				
				manifestItemPO.setOutstorehouse(goodsStorehouseStockService.outstorehouse(gid,cid,fid, oshId, num));
				storehouseStockService.updateStorehouseStock(oshId, month, -num);
				
				float _total = Arith.sub(total, manifestItemPO.getUnitPrice());
				totals = Arith.add(totals,Arith.mul(_total, num));
			}
			
			manifestItemPO.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItemPO);
			
		}
		
		manifestPO.setTotal(totals);
		
		manifestDao.update(manifestPO);
		
		AccessoriesPO accessoriesPO;
		AccessoriesManifestPO accessoriesManifestPO;
		for(AccessoriesVO accessoriesVO : accessoriesVOs){
			
			accessoriesPO = accessoriesDao.get(accessoriesVO.getAid());
			
			if(accessoriesPO.getStatus() != 0){
				throw new FLException(260024, "辅料单状态不可操作");
			}
			
			accessoriesPO.setStatus(AccessoriesPO.STATUS_DISABLE_INT);
			accessoriesPO.setApprover(userPO);
			accessoriesPO.setApproverTime(DateUtil.getDateToTimestamp(new Date()));
			
			accessoriesDao.update(accessoriesPO);
			
			accessoriesManifestPO = new AccessoriesManifestPO(accessoriesPO,manifestPO);
			
			accessoriesManifestDao.save(accessoriesManifestPO);
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForPS(List<ManifestItemPO> manifestItemPOs, String userId, int company) throws FLException {
		
		CompanyPO companyPO = companyDao.get(company);
		
		if(companyPO == null){
			throw new FLException(230015, "公司不存在");
		}
		
		String word = "PS";//套拆
		String comment = "";
		String attachment = "";
		float total = 0f;
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PS_INT,currentDate, company);
		String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		String manifestId = companyPO.getShortname() + String.valueOf(word) + currentDate + endNo;
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		manifestPO.setAttachment(attachment);
		manifestPO.setComment(comment);
		manifestPO.setTotal(total);
		manifestPO.setType(ManifestPO.TYPE_PS_INT);
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setManifestTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setCreateUser(userPO);
		manifestPO.setStatus(ManifestPO.STATUS_DISABLE_INT);
		manifestPO.setCompany(company);
		
		manifestDao.save(manifestPO);
		
		addManifestForPackage(manifestItemPOs, comment, manifestPO);
		
		return 0;
	
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestForPM(List<ManifestItemPO> manifestItemPOs, String userId, int company)throws FLException {
		
		CompanyPO companyPO = companyDao.get(company);
		
		if(companyPO == null){
			throw new FLException(230015, "公司不存在");
		}
		
		String word = "PM";
		String comment = "";
		String attachment = "";
		float total = 0f;
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PM_INT,currentDate, company);
		String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		String manifestId = companyPO.getShortname() + String.valueOf(word) + currentDate + endNo;
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		manifestPO.setAttachment(attachment);
		manifestPO.setComment(comment);
		manifestPO.setTotal(total);
		manifestPO.setType(ManifestPO.TYPE_PM_INT);
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setManifestTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setCreateUser(userPO);
		manifestPO.setStatus(ManifestPO.STATUS_DISABLE_INT);
		manifestPO.setCompany(company);
		
		manifestDao.save(manifestPO);
		
		addManifestForPackage(manifestItemPOs, comment, manifestPO);
		
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
		
		manifestDao.update(manifestPO);
		
		return 0;
	}

	@Override
	public int addManifestForPackage(List<ManifestItemPO> manifestItemPOs,String comment, ManifestPO manifestPO) throws FLException {
		
		for(ManifestItemPO manifestItem : manifestItemPOs){
			
			if(manifestItem.getOutstorehouse() != null){
				
				StorehousePO storehousePO = storehouseDao.get(manifestItem.getOutstorehouse().getShId());
				
				if(storehousePO == null){
					throw new FLException(260005, "仓库不存在");
				}
				
				manifestItem.setOutstorehouse(manifestItem.getOutstorehouse());
				
			}
			
			if(manifestItem.getInstorehouse() != null){
				
				StorehousePO storehousePO = storehouseDao.get(manifestItem.getInstorehouse().getShId());
				
				if(storehousePO == null){
					throw new FLException(260005, "仓库不存在");
				}
				
				manifestItem.setInstorehouse(manifestItem.getInstorehouse());
				
			}
			
			manifestItem.setUnitPrice(0f);
			manifestItem.setComment(comment);
			manifestItem.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItem);
			
		}
		
		return 0;
	}

}
