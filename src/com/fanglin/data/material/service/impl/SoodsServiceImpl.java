package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.dao.SoodsDao;
import com.fanglin.data.material.dao.SoodsItemDao;
import com.fanglin.data.material.service.SoodsService;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.material.vo.SoodsVO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.SoodsItemPO;
import com.fanglin.data.po.SoodsPO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("soodsService")
@Transactional(readOnly = true)
public class SoodsServiceImpl implements SoodsService {

	@Autowired
	private SoodsDao soodsDao;

	@Autowired
	private SoodsItemDao soodsItemDao;

	@Autowired
	private GoodsDao goodsDao;

	@Autowired
	private BrandDao brandDao;

	@Override
	public void pageSoods(Paging paging, List<Filter> filters, int company) {

		List<SoodsPO> soodsPOs = soodsDao.pageSoods(paging, filters, company);
		List<SoodsVO> soodsVOs = new ArrayList<SoodsVO>();

		for (SoodsPO soodsPO : soodsPOs) {

			SoodsVO soodsVO = new SoodsVO(new GoodsVO(), new QuotationItemVO(new QuotationVersionVO()));

			BeanUtil.copyProperties(soodsPO, soodsVO, Arrays.asList("goods"));
			BeanUtil.copyProperties(soodsPO.getGoods(), soodsVO.getGoods(), Arrays.asList("accessoriesType"));

			soodsVOs.add(soodsVO);
		}

		paging.setData(soodsVOs);
	}

	@Override
	public void pageSoodsByQiid(Paging paging, List<Filter> filters, SoodsVO soodsVO) {

		List<SoodsItemPO> soodsItemPOs = soodsItemDao.pageSoodsItemByQiid(paging, filters, soodsVO.getQuotationItem().getQiid());
		List<SoodsVO> soodsVOs = new ArrayList<SoodsVO>();

		for (SoodsItemPO soodsItemPO : soodsItemPOs) {

			soodsVO = new SoodsVO(new GoodsVO(), new QuotationItemVO(new QuotationVersionVO()));

			BeanUtil.copyProperties(soodsItemPO.getSoods(), soodsVO, Arrays.asList("goods"));
	
			BeanUtil.copyProperties(soodsItemPO.getSoods().getGoods(), soodsVO.getGoods(), Arrays.asList("accessoriesType"));

			soodsItemPO.getQuotationItem().ptv(soodsVO.getQuotationItem());

			soodsVOs.add(soodsVO);
		}

		paging.setData(soodsVOs);
	}

	@Override
	public void pageSoodsBySid(Paging paging, List<Filter> filters, SoodsVO soodsVO) {
		
		List<SoodsItemPO> soodsItemPOs = soodsItemDao.pageSoodsItemBySid(paging, filters, soodsVO.getSid());
		List<SoodsVO> soodsVOs = new ArrayList<SoodsVO>();

		for (SoodsItemPO soodsItemPO : soodsItemPOs) {

			soodsVO = new SoodsVO(new GoodsVO(), new QuotationItemVO(new QuotationVersionVO()));

			BeanUtil.copyProperties(soodsItemPO.getSoods(), soodsVO, Arrays.asList("goods","quotationItem"));
			
			BeanUtil.copyProperties(soodsItemPO.getQuotationItem(), soodsVO.getQuotationItem(), Arrays.asList("category","classification","bigCategory","smallCategory","workType","unit"));
			
			BeanUtil.copyProperties(soodsItemPO.getQuotationItem().getQuotationVersion(), soodsVO.getQuotationItem().getVersion());
			
			BeanUtil.copyProperties(soodsItemPO.getSoods().getGoods(), soodsVO.getGoods(), Arrays.asList("accessoriesType"));
			
			soodsVOs.add(soodsVO);
		}

		paging.setData(soodsVOs);
	}
		
		
	@Override
	public List<SoodsVO> querySoodsByQiid(SoodsVO soodsVO) throws FLException {

		List<SoodsItemPO> SoodsItemPOs = soodsItemDao.querySoodsItemByQiid(soodsVO.getQuotationItem().getQiid());
		List<SoodsVO> soodsVOs = new ArrayList<SoodsVO>();

		for (SoodsItemPO soodsItemPO : SoodsItemPOs) {

			soodsVO = new SoodsVO(new GoodsVO(), new QuotationItemVO());

			BeanUtil.copyProperties(soodsItemPO.getSoods(), soodsVO, Arrays.asList("goods"));
			BeanUtil.copyProperties(soodsItemPO.getSoods().getGoods(), soodsVO.getGoods(), Arrays.asList("accessoriesType"));

			soodsItemPO.getQuotationItem().ptv(soodsVO.getQuotationItem());

			soodsVOs.add(soodsVO);
		}

		return soodsVOs;
	}
	
	@Override
	public List<SoodsVO> querySoodsBySid(SoodsVO soodsVO) throws FLException {
		
		List<SoodsItemPO> soodsItemPOs = soodsItemDao.querySoodsItemBySid(soodsVO.getSid());
		List<SoodsVO> soodsVOs = new ArrayList<SoodsVO>();

		for (SoodsItemPO soodsItemPO : soodsItemPOs) {

			soodsVO = new SoodsVO(new GoodsVO(), new QuotationItemVO(new QuotationVersionVO()));

			BeanUtil.copyProperties(soodsItemPO.getSoods(), soodsVO, Arrays.asList("goods","quotationItem"));
			
			BeanUtil.copyProperties(soodsItemPO.getQuotationItem(), soodsVO.getQuotationItem(), Arrays.asList("category","classification","bigCategory","smallCategory","workType","unit"));
			
			BeanUtil.copyProperties(soodsItemPO.getSoods().getGoods(), soodsVO.getGoods(), Arrays.asList("accessoriesType"));
			
			soodsVOs.add(soodsVO);
		}


		return soodsVOs;
	}
	
	@Override
	public List<SoodsVO> querySoodsByName(SoodsVO soodsVO, int company) {
		
		List<SoodsPO> soodsPOs = soodsDao.querySoodsByName(soodsVO.getGoods().getName(), 10,company);
		List<SoodsVO> soodsVOs = new ArrayList<SoodsVO>();
		
		for(SoodsPO soodsPO: soodsPOs){
			
			soodsVO = new SoodsVO(new GoodsVO(),new QuotationItemVO());
			
			BeanUtil.copyProperties(soodsPO, soodsVO,Arrays.asList("goods"));
			BeanUtil.copyProperties(soodsPO.getGoods(), soodsVO.getGoods(),Arrays.asList("accessoriesType"));
				
			soodsVOs.add(soodsVO);
		}
		
		return soodsVOs;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSoods(SoodsVO soodsVO, int company) throws FLException {

		GoodsPO goodsPO = goodsDao.get(soodsVO.getGoods().getGid());
		SoodsPO soodsPO = new SoodsPO();
		
		if (goodsPO == null) {
			throw new FLException(260004, "商品不存在");
		}

		BrandPO brandPO = brandDao.queryBrandByBid(goodsPO.getBid());

		if (brandPO == null || brandPO.getSupplier() == null) {
			throw new FLException(130036, "商品无关联厂商");
		}
		
		soodsPO.setGoods(goodsPO);
		soodsPO.setNum(soodsVO.getNum());
		soodsPO.setStatus(SoodsPO.STATUS_INVALID_INT);
		soodsPO.setSelling(soodsVO.getSelling());
		soodsPO.setCompany(company);
		soodsDao.save(soodsPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSoodsItem(SoodsVO soodsVO, long sid) throws FLException {

		SoodsPO soodsPO = soodsDao.get(soodsVO.getSid());

		if (soodsPO == null) {
			throw new FLException(200038, "选材项不存在");
		}

		if (soodsPO.getSelling() > soodsVO.getQuotationItem().getUnitPrice()) {
			throw new FLException(130037  , "选材结算金额不符");
		}
		
		if (soodsItemDao.countSoodsItem(soodsVO.getGoods().getGid(), soodsVO.getQuotationItem().getQiid()) > 0) {
			throw new FLException(130032, "选材已存在");
		}

		SoodsItemPO soodsItemPO = new SoodsItemPO();

		soodsItemPO.setQuotationItem(new QuotationItemPO(soodsVO.getQuotationItem().getQiid()));
		soodsItemPO.setSoods(soodsPO);

		soodsItemPO.setStatus(SoodsItemPO.STATUS_INIT_INT);

		soodsItemDao.save(soodsItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSoods(SoodsVO soodsVO) throws FLException {

		SoodsPO soodsPO = soodsDao.get(soodsVO.getSid());

		soodsPO.setSelling(soodsVO.getSelling());

		soodsDao.update(soodsPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSoodsForStatus(List<SoodsVO> soodes) throws FLException {

		for (SoodsVO soods : soodes) {

			SoodsPO soodsPO = soodsDao.get(soods.getSid());

			if (soodsPO == null)
				continue;

			soodsPO.setStatus(soods.getStatus());

			soodsDao.update(soodsPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int copySoods(SoodsVO soodsVO) throws FLException {

		soodsItemDao.deleteSoodsItem(soodsVO.getSid(),soodsVO.getQuotationItem().getQiid());
		soodsItemDao.copySoodsItem(soodsVO.getQiid(), soodsVO.getQuotationItem().getQiid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSoods(SoodsVO soodsVO) throws FLException {

		SoodsPO soodsPO = soodsDao.get(soodsVO.getSid());
		
		if (soodsPO.getStatus() == 0) {
			throw new FLException(130034  ,"选材状态不可操作");
		}

		soodsDao.deleteSoods(soodsPO.getSid());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSoodsItem(SoodsVO soodsVO) throws FLException {

		soodsItemDao.deleteSoodsItem(soodsVO.getSid(),soodsVO.getQuotationItem().getQiid());
		
		return 0;
	}
}
