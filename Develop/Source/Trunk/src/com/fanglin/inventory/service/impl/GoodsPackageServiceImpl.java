package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.GoodsDao;
import com.fanglin.inventory.dao.GoodsPackageDao;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.GoodsPackagePO;
import com.fanglin.inventory.service.GoodsPackageService;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsPackageVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.utils.BeanUtil;

@Service("goodsPackageService")
@Transactional(readOnly=true)
public class GoodsPackageServiceImpl implements GoodsPackageService{
	
	@Autowired
	private GoodsPackageDao goodsPackageDao;
	
	@Autowired
	private GoodsDao goodsDao;

	@Override
	public List<GoodsPackageVO> queryPackage(GoodsPackageVO goodsPackageVO) {
		
		List<GoodsPackagePO> goodsPackagePOs = goodsPackageDao.queryPackage(goodsPackageVO.getPid());
		List<GoodsPackageVO> goodsPackageVOs = new ArrayList<GoodsPackageVO>();
		
		for(GoodsPackagePO goodsPackagePO: goodsPackagePOs){
			
			goodsPackageVO = new GoodsPackageVO(new GoodsVO(),new ColorVO(),new FormatVO());
			
			BeanUtil.copyProperties(goodsPackagePO, goodsPackageVO , Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(goodsPackagePO.getGoods(), goodsPackageVO.getGoods(), Arrays.asList("assisType"));
			BeanUtil.copyProperties(goodsPackagePO.getColor(), goodsPackageVO.getColor());
			BeanUtil.copyProperties(goodsPackagePO.getFormat(), goodsPackageVO.getFormat());
			
			goodsPackageVOs.add(goodsPackageVO);
			
		}
		
		return goodsPackageVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int bindGoodsForPackage(GoodsPackageVO goodsPackageVO)throws FLException {
		
		GoodsPO goodsPO = goodsDao.get(goodsPackageVO.getPid());
		
		if(goodsPO == null){
			throw new FLException(260004 , "商品不存在");
		}
		
		goodsPO = goodsDao.get(goodsPackageVO.getGoods().getGid());
		
		if(goodsPO == null){
			throw new FLException(260004, "商品不存在");
		}
		/*
		List<GoodsPackagePO> goodsPackagePOs = goodsPackageDao.queryGoodsForPackage(goodsPackageVO.getPid());
		
		for(GoodsPackagePO goodsPackagePO : goodsPackagePOs){
			if(goodsPackagePO.getGoods().getGid() == goodsPackageVO.getGoods().getGid() && goodsPackagePO.getColor().getCid() ==goodsPackageVO.getColor().getCid()&&goodsPackagePO.getFormat().getFid()==goodsPackageVO.getFormat().getFid()){
				throw new FLException(160032, "套餐中商品已存在"); 
			}
		}*/
		
		GoodsPackagePO goodsPackagePO = new GoodsPackagePO(new GoodsPO(),new ColorPO(),new FormatPO());
		
		BeanUtil.copyProperties(goodsPackageVO, goodsPackagePO , Arrays.asList("goods","color","format"));
		BeanUtil.copyProperties(goodsPackageVO.getGoods(), goodsPackagePO.getGoods(), Arrays.asList("assisType"));
		BeanUtil.copyProperties(goodsPackageVO.getColor(), goodsPackagePO.getColor());
		BeanUtil.copyProperties(goodsPackageVO.getFormat(), goodsPackagePO.getFormat());
		
		goodsPO = goodsDao.get(goodsPackageVO.getPid());
		
		goodsPO.setType(GoodsPO.TYPE_SUIT_INT);
		
		goodsDao.update(goodsPO);
		
		goodsPackageDao.save(goodsPackagePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteGoodsForPackage(GoodsPackageVO goodsPackageVO)throws FLException {
		
		GoodsPackagePO goodsPackagePO = goodsPackageDao.get(goodsPackageVO.getGpid());
		
		if(goodsPackagePO == null){
			throw new FLException(260004, "商品不存在");
		}
		
		goodsPackageDao.delete(goodsPackagePO);
		
		List<GoodsPackagePO> goodsPackagePOs = goodsPackageDao.queryPackage(goodsPackageVO.getPid());
		
		GoodsPO goodsPO;
		
		if(goodsPackagePOs.size()==0){
			
			goodsPO = goodsDao.get(goodsPackageVO.getPid());
			
			goodsPO.setType(GoodsPO.TYPE_GOODS_INT);
			
			goodsDao.update(goodsPO);
		}
		
		return 0;
	}

}
