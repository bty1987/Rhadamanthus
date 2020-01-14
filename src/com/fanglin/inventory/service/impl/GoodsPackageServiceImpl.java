package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.inventory.dao.GoodsPackageDao;

import com.fanglin.inventory.po.GoodsPackagePO;
import com.fanglin.inventory.service.GoodsPackageService;
import com.fanglin.inventory.vo.GoodsPackageVO;
import com.fanglin.utils.BeanUtil;

@Service("goodsPackageService")
@Transactional(readOnly=true)
public class GoodsPackageServiceImpl implements GoodsPackageService{
	
	@Autowired
	private GoodsPackageDao goodsPackageDao;

	@Override
	public List<GoodsPackageVO> queryPackage(GoodsPackageVO goodsPackageVO) {
		
		List<GoodsPackagePO> goodsPackagePOs = goodsPackageDao.queryPackage(goodsPackageVO.getPid());
		List<GoodsPackageVO> goodsPackageVOs = new ArrayList<GoodsPackageVO>();
		
		for(GoodsPackagePO goodsPackagePO: goodsPackagePOs){
			
			goodsPackageVO = new GoodsPackageVO(new GoodsVO(),new ColorVO(),new FormatVO());
			
			BeanUtil.copyProperties(goodsPackagePO, goodsPackageVO , Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(goodsPackagePO.getGoods(), goodsPackageVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(goodsPackagePO.getColor(), goodsPackageVO.getColor());
			BeanUtil.copyProperties(goodsPackagePO.getFormat(), goodsPackageVO.getFormat());
			
			goodsPackageVOs.add(goodsPackageVO);
			
		}
		
		return goodsPackageVOs;
	}
	
	
}
