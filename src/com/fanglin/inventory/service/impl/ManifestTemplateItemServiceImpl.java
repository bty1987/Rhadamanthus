/**
 * @File Name		: ManifestTemplateItemServiceImpl.java
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

import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.inventory.dao.ManifestTemplateItemDao;
import com.fanglin.inventory.po.ManifestTemplateItemPO;
import com.fanglin.inventory.po.ManifestTemplatePO;
import com.fanglin.inventory.service.ManifestTemplateItemService;
import com.fanglin.inventory.vo.ManifestTemplateItemVO;
import com.fanglin.inventory.vo.ManifestTemplateVO;
import com.fanglin.utils.BeanUtil;


@Service("manifestTemplateItemService")
@Transactional(readOnly=true)
public class ManifestTemplateItemServiceImpl implements ManifestTemplateItemService {
	
	@Autowired
	private ManifestTemplateItemDao manifestTemplateItemDao;

	@Override
	public List<ManifestTemplateItemVO> queryManifestTemplateItemByMtid(ManifestTemplateVO manifestTemplateVO) {
		
		List<ManifestTemplateItemPO> manifestTemplateItemPOs = manifestTemplateItemDao.queryManifestTemplateItemByMtid(manifestTemplateVO.getMtid());
		List<ManifestTemplateItemVO> manifestTemplateItemVOs = new ArrayList<ManifestTemplateItemVO>();
		
		ManifestTemplateItemVO manifestTemplateItemVO;
		
		for(ManifestTemplateItemPO manifestTemplateItemPO: manifestTemplateItemPOs){
			
			manifestTemplateItemVO = new ManifestTemplateItemVO(new GoodsVO(), new ManifestTemplateVO());
			
			manifestTemplateItemVO.setMtiid(manifestTemplateItemPO.getMtiid());
			
			BeanUtil.copyProperties(manifestTemplateItemPO.getGoods(), manifestTemplateItemVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(manifestTemplateItemPO.getManifestTemplate(), manifestTemplateItemVO.getManifestTemplate());
			
			manifestTemplateItemVOs.add(manifestTemplateItemVO);
		}
		
		return manifestTemplateItemVOs;
	}

	@Override
	public List<GoodsVO> queryGoodsByMtid(ManifestTemplateVO manifestTemplateVO) {
		
		List<ManifestTemplateItemPO> manifestTemplateItemPOs = manifestTemplateItemDao.queryManifestTemplateItemByMtid(manifestTemplateVO.getMtid());
		List<GoodsVO> goodsVOs = new ArrayList<GoodsVO>();
		
		GoodsVO goodsVO;
		
		for(ManifestTemplateItemPO manifestTemplateItemPO: manifestTemplateItemPOs){
			
			goodsVO = new GoodsVO();
			
			BeanUtil.copyProperties(manifestTemplateItemPO.getGoods(), goodsVO);
			
			goodsVOs.add(goodsVO);
		}
		
		return goodsVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addManifestTemplateItem(ManifestTemplateVO manifestTemplateVO, List<Long> gids) {
		
		long mtid = manifestTemplateVO.getMtid();
		
		if(gids != null && gids.size() > 0){
			
			for(Long gid: gids){
				manifestTemplateItemDao.save(new ManifestTemplateItemPO(new ManifestTemplatePO(mtid), new GoodsPO(gid)));
			}
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteManifestTemplateItem(List<Long> mtiids) {
		
		manifestTemplateItemDao.deleteManifestTemplateItemByMtiids(mtiids);
		
		return 0;
	}

}
