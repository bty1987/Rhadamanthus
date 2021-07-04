package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.AdditemPO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.quotation.dao.AdditemDao;
import com.fanglin.data.quotation.service.AdditemService;
import com.fanglin.data.quotation.vo.AdditemVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;


@Service("additemService")
@Transactional(readOnly = true)
public class AdditemServiceImpl implements AdditemService{
	
	@Autowired
	private AdditemDao additemDao;

	@Override
	public void pageAdditem(Paging paging, List<Filter> filters, int company) {
		
		List<AdditemPO> additemPOs = additemDao.pageAdditem(paging, filters,company);
		List<AdditemVO> additemVOs = new ArrayList<AdditemVO>();
		
		AdditemVO additem;
		
		for (AdditemPO additemPO : additemPOs) {
			
			additem = new AdditemVO(new ConstructionNodeVO());
			
			BeanUtil.copyProperties(additemPO, additem, Arrays.asList("constructionNode"));
			BeanUtil.copyProperties(additemPO.getConstructionNode(), additem.getConstructionNode());
			
			additemVOs.add(additem);
		}
		
		paging.setData(additemVOs);
		
	}

	@Override
	public List<AdditemVO> queryAdditem(AdditemVO additemVO, int company) {

		List<AdditemPO> additemPOs = additemDao.queryAdditem(additemVO.getConstructionNode().getSort(),company);
		List<AdditemVO> additemVOs = new ArrayList<AdditemVO>();
		
		AdditemVO additem;
		
		for (AdditemPO additemPO : additemPOs) {
			
			additem = new AdditemVO(new ConstructionNodeVO());
			
			BeanUtil.copyProperties(additemPO, additem, Arrays.asList("constructionNode"));
			BeanUtil.copyProperties(additemPO.getConstructionNode(), additem.getConstructionNode());
			
			additemVOs.add(additem);
		}
		
		return additemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAdditem(AdditemVO additemVO, int company) {
		
		AdditemPO additemPO = new AdditemPO(new ConstructionNodePO());
		
		additemPO.setName(additemVO.getName());
		additemPO.getConstructionNode().setCnid(additemVO.getConstructionNode().getCnid());
		additemPO.setCompany(company);

		additemDao.save(additemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAdditemForStatus(AdditemVO additemVO) {
		
		AdditemPO additemPO = additemDao.get(additemVO.getAiid());
		
		if(additemPO != null){
			
			additemPO.setStatus(additemVO.getStatus());
			
			additemDao.update(additemPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteAdditem(AdditemVO additemVO) {

		AdditemPO additemPO = additemDao.get(additemVO.getAiid());
		
		if(additemPO != null){
			
			additemDao.delete(additemPO);
		}
		
		return 0;
	}

}
