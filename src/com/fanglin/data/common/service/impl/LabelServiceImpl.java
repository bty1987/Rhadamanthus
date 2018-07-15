package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.LabelDao;
import com.fanglin.data.common.service.LabelService;
import com.fanglin.data.common.vo.LabelVO;
import com.fanglin.data.po.LabelPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("labelService")
@Transactional(readOnly = true)
public class LabelServiceImpl implements LabelService {

	@Autowired
	private LabelDao labelDao;
	
	@Override
	public void pageLabel(Paging paging, List<Filter> filters) {	
		
		List<LabelPO> labelPOs = labelDao.pageLabel(paging, filters);
		List<LabelVO> labelVOs = new ArrayList<LabelVO>();
		
		for(LabelPO labelPO : labelPOs){
			
			LabelVO labelVO = new LabelVO();
			
			BeanUtil.copyPropertie(labelPO, labelVO);
			
			labelVOs.add(labelVO);
		}
		paging.setData(labelVOs);
		
	}
	
	@Override
	public List<LabelVO> queryLabel(LabelVO labelVO) {
		
		List<LabelPO> labelPOs = labelDao.queryLabel(labelVO.getStatus());
		List<LabelVO> labelVOs = new ArrayList<LabelVO>();
		
		LabelVO label;
		
		for(LabelPO labelPO : labelPOs){
			
			label = new LabelVO();
			
			label.setName(labelPO.getName());
			label.setScale(labelPO.getScale());
			label.setStatus(labelPO.getStatus());
			label.setType(labelPO.getType());
			label.setLid(labelPO.getLid());
			
			labelVOs.add(label);
			
		}
 		
		return labelVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addLabel(LabelVO labelVO) {
		LabelPO labelPO = new LabelPO();
		
		BeanUtil.copyPropertie(labelVO, labelPO);
		
		labelPO.setStatus(LabelPO.STATUS_ENABLE_STR);
		labelPO.setIsShow(LabelPO.STATUS_ISSHOW_STR);
		
		labelDao.save(labelPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateLabel(LabelVO labelVO) throws FLException {
		
		LabelPO labelPO = labelDao.get(labelVO.getLid());
		
		if(labelPO == null){
			
			throw new FLException(130024, "标签不存在");
		}
		
		BeanUtil.copyPropertie(labelVO, labelPO);
		
		labelDao.update(labelPO);
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateLabelForStatus(LabelVO labelVO) throws FLException {
		
		LabelPO labelPO = labelDao.get(labelVO.getLid());
		
		if(labelPO == null){
			
			throw new FLException(130024, "标签不存在");
		}
		
		labelPO.setStatus(labelVO.getStatus());
		
		labelDao.update(labelPO);
	}
	
}
