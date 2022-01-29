package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.PackitemPO;
import com.fanglin.data.quotation.dao.PackitemDao;
import com.fanglin.data.quotation.service.PackitemService;
import com.fanglin.data.quotation.vo.PackitemVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;


@Service("packitemService")
@Transactional(readOnly = true)
public class PackitemServiceImpl implements PackitemService{
	
	@Autowired
	private PackitemDao packitemDao;

	@Override
	public void pagePackitem(Paging paging, List<Filter> filters) {
		
		List<PackitemPO> packitemPOs = packitemDao.pagePackitem(paging, filters);
		List<PackitemVO> packitemVOs = new ArrayList<PackitemVO>();
		
		PackitemVO additem;
		
		for (PackitemPO packitemPO : packitemPOs) {
			
			additem = new PackitemVO(new ConstructionNodeVO());
			
			BeanUtil.copyProperties(packitemPO, additem, Arrays.asList("constructionNode"));
			BeanUtil.copyProperties(packitemPO.getConstructionNode(), additem.getConstructionNode());
			
			packitemVOs.add(additem);
		}
		
		paging.setData(packitemVOs);
		
	}

	@Override
	public List<PackitemVO> queryPackitem(PackitemVO packitemVO) {

		List<PackitemPO> packitemPOs = packitemDao.queryPackitem(packitemVO.getConstructionNode().getSort());
		List<PackitemVO> packitemVOs = new ArrayList<PackitemVO>();
				
		PackitemVO additem;
		
		for (PackitemPO packitemPO : packitemPOs) {
			
			additem = new PackitemVO(new ConstructionNodeVO());
			
			BeanUtil.copyProperties(packitemPO, additem, Arrays.asList("constructionNode"));
			BeanUtil.copyProperties(packitemPO.getConstructionNode(), additem.getConstructionNode());
			
			packitemVOs.add(additem);
		}
		
		return packitemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addPackitem(PackitemVO packitemVO) {
		
		PackitemPO packitemPO = new PackitemPO(new ConstructionNodePO());
		
		BeanUtil.copyProperties(packitemVO, packitemPO, Arrays.asList("constructionNode"));
		
		packitemPO.getConstructionNode().setCnid(packitemVO.getConstructionNode().getCnid());

		packitemDao.save(packitemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePackitemForStatus(PackitemVO packitemVO) {
		
		PackitemPO packitemPO = packitemDao.get(packitemVO.getPiid());
		
		if(packitemPO != null){
			
			packitemPO.setStatus(packitemVO.getStatus());
			
			packitemDao.update(packitemPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deletePackitem(PackitemVO packitemVO) {

		PackitemPO packitemPO = packitemDao.get(packitemVO.getPiid());
		
		if(packitemPO != null){
			
			packitemDao.delete(packitemPO);
		}		
		return 0;
	}
}
