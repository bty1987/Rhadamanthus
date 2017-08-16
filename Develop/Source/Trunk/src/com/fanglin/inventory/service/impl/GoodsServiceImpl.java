/**
 * @File Name		: GoodsServiceImpl.java
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
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.AssisTypeDao;
import com.fanglin.inventory.dao.GoodsDao;
import com.fanglin.inventory.po.AssisTypePO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.service.GoodsService;
import com.fanglin.inventory.vo.AssisTypeVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("goodsService")
@Transactional(readOnly=true)
public class GoodsServiceImpl implements GoodsService {
	
	@Autowired
	private GoodsDao goodsDao;
	
	@Autowired
	private AssisTypeDao assisTypeDao;
	
	@Override
	public void pageGoods(Paging paging, List<Filter> filters,int company) throws FLException{
		
		List<GoodsPO> goodsPOs = goodsDao.pageGoods(paging, filters,company);
		List<GoodsVO> goodsVOs = new ArrayList<GoodsVO>();
		
		GoodsVO goodsVO;
		
		for(GoodsPO goodsPO: goodsPOs){
				
			goodsVO = new GoodsVO(new AssisTypeVO());
				
			BeanUtil.copyProperties(goodsPO, goodsVO , Arrays.asList("assisType"));
			BeanUtil.copyProperties(goodsPO.getAssisType(), goodsVO.getAssisType(), Arrays.asList("workType"));
				
			goodsVOs.add(goodsVO);
				
		}

		paging.setData(goodsVOs);
	}

	@Override
	public List<GoodsVO> queryGoods(List<Filter> filters,int company) throws FLException{
		
		List<GoodsPO> goodsPOs = goodsDao.queryGoods(filters,company);
		List<GoodsVO> goodsVOs = new ArrayList<GoodsVO>();
		
		GoodsVO goodsVO;
		
		for(GoodsPO goodsPO: goodsPOs){
			
			goodsVO = new GoodsVO(new AssisTypeVO());
			
			BeanUtil.copyProperties(goodsPO, goodsVO,Arrays.asList("assisType"));
			BeanUtil.copyProperties(goodsPO.getAssisType(), goodsVO.getAssisType(), Arrays.asList("workType"));
			
			goodsVOs.add(goodsVO);
		}
		
		return goodsVOs;
	}

	@Override
	public List<GoodsVO> queryGoodsByNo(GoodsVO goodsVO,int company){
		
		List<GoodsPO> goodsPOs = goodsDao.queryGoodsByNo(goodsVO.getNo(), 10,company);
		List<GoodsVO> goodsVOs = new ArrayList<GoodsVO>();
		
		for(GoodsPO goodsPO: goodsPOs){
			
			goodsVO = new GoodsVO(new AssisTypeVO());
			
			BeanUtil.copyProperties(goodsPO, goodsVO,Arrays.asList("assisType"));
			BeanUtil.copyProperties(goodsPO.getAssisType(), goodsVO.getAssisType(), Arrays.asList("workType"));
			
			goodsVOs.add(goodsVO);
		}
		
		return goodsVOs;
	}

	@Override
	public List<GoodsVO> queryGoodsByName(GoodsVO goodsVO,int company){

		List<GoodsPO> goodsPOs = goodsDao.queryGoodsByName(goodsVO.getName(),goodsVO.getPinyin(),goodsVO.getNo(), 10,company);
		List<GoodsVO> goodsVOs = new ArrayList<GoodsVO>();
		
		for(GoodsPO goodsPO: goodsPOs){
			
			goodsVO = new GoodsVO(new AssisTypeVO());
			
			BeanUtil.copyProperties(goodsPO, goodsVO,Arrays.asList("assisType"));
			BeanUtil.copyProperties(goodsPO.getAssisType(), goodsVO.getAssisType(),Arrays.asList("workType"));
			
			goodsVOs.add(goodsVO);
		}
		
		return goodsVOs;
	}
	
	@Override
	public List<GoodsVO> queryGoodsByAtid(GoodsVO goodsVO,int company){
		
		List<GoodsPO> goodsPOs = goodsDao.queryGoodsByAtid(goodsVO.getAssisType().getAtid(),company);
		List<GoodsVO> goodsVOs = new ArrayList<GoodsVO>();
		
		for(GoodsPO goodsPO: goodsPOs){
			
			goodsVO = new GoodsVO(new AssisTypeVO());
			
			BeanUtil.copyProperties(goodsPO, goodsVO , Arrays.asList("assisType"));
			BeanUtil.copyProperties(goodsPO.getAssisType(), goodsVO.getAssisType(), Arrays.asList("workType"));
			
			goodsVOs.add(goodsVO);
			
		}
		
		return goodsVOs;
	}

	@Override
	public GoodsVO queryGoodsByBarcode(GoodsVO goodsVO,int company){

		GoodsPO goodsPO = goodsDao.queryGoodsByBarcode(goodsVO.getBarcode(),company);
		
		goodsVO = new GoodsVO(new AssisTypeVO());
		
		BeanUtil.copyProperties(goodsPO, goodsVO ,Arrays.asList("assisType"));
		BeanUtil.copyProperties(goodsPO.getAssisType(), goodsVO.getAssisType(),Arrays.asList("workType"));
		
		return goodsVO;
	}

	@Override
	public GoodsVO queryGoodsByGId(GoodsVO goodsVO) {
		
		GoodsPO goodsPO = goodsDao.get(goodsVO.getGid());
		
		goodsVO = new GoodsVO(new AssisTypeVO());
		
		BeanUtil.copyProperties(goodsPO, goodsVO ,Arrays.asList("assisType"));
		BeanUtil.copyProperties(goodsPO.getAssisType(), goodsVO.getAssisType(),Arrays.asList("workType"));
		
		return goodsVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addGoods(GoodsVO goodsVO,int company) throws FLException {
		
		GoodsPO goodsPO;
		
		if(goodsVO.getAssisType().getAtid()!=null){
			goodsPO = new GoodsPO(new AssisTypePO());
			BeanUtil.copyProperties(goodsVO, goodsPO, Arrays.asList("assisType","gid", "type" ,"status"));
			BeanUtil.copyProperties(goodsVO.getAssisType(), goodsPO.getAssisType(),Arrays.asList("workType"));
			
		}else{
			goodsPO = new GoodsPO();
			BeanUtil.copyProperties(goodsVO, goodsPO, Arrays.asList("assisType","gid", "type" ,"status"));
		}
		
		List<String> pinyins = PinYin4Util.getPinyin(goodsVO.getName());
	    
		goodsPO.setPinyin(pinyins.subList(0, pinyins.size() >= 2 ? 2 : pinyins.size()).toString());
		
		goodsPO.setStatus(GoodsPO.STATUS_ENABLE_INT);
		goodsPO.setType(GoodsPO.TYPE_GOODS_INT);
		goodsPO.setCompany(company);
		
		goodsDao.save(goodsPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateGoods(GoodsVO goodsVO) throws FLException {
		
		GoodsPO goodsPO = goodsDao.get(goodsVO.getGid());
		
		if(goodsPO == null){
			throw new FLException(260004, "商品不存在");
		}
		
		if(goodsVO.getAssisType().getAtid()!=null){
			
			AssisTypePO assisTypePO = assisTypeDao.get(goodsVO.getAssisType().getAtid());
			
			goodsPO.setAssisType(assisTypePO);
		}else{
			goodsPO.setAssisType(null);
		}
		
		goodsDao.update(goodsPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateGoodsForStatus(GoodsVO goodsVO) throws FLException {
		
		GoodsPO goodsPO = goodsDao.get(goodsVO.getGid());
		
		if(goodsPO == null){
			throw new FLException(260004, "商品不存在");
		}
		
		goodsPO.setStatus(goodsVO.getStatus());
		
		goodsDao.update(goodsPO);
		
		return 0;
	}

}
