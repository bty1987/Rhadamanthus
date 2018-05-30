package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
	public List<LabelVO> querylabel(LabelVO label) {
		
		List<LabelPO> labelPOs = labelDao.querylabel(label.getStatus());
		List<LabelVO> labelVOs = new ArrayList<LabelVO>();
		
		LabelVO labelVO;
		
		for(LabelPO labelPO : labelPOs){
			
			labelVO = new LabelVO();
			
			labelVO.setName(labelPO.getName());
			labelVO.setProportion(labelPO.getProportion());
			labelVO.setStatus(labelPO.getStatus());
			labelVO.setType(labelPO.getType());
			labelVO.setLid(labelPO.getLid());
			
			labelVOs.add(labelVO);
			
		}
 		
		return labelVOs;
	}

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
	@Transactional(rollbackFor = Exception.class)
	public void updataForStatus(LabelVO labelVO) {
		
		LabelPO labelPO = labelDao.get(labelVO.getLid());
		
		labelPO.setStatus((short) labelVO.getStatus());
		
		labelDao.update(labelPO);
	}

	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addLabel(LabelVO labelVO) {
		LabelPO labelPO = new LabelPO();
		
		BeanUtil.copyPropertie(labelVO, labelPO);
		
		labelPO.setStatus((short)0);
		
		labelDao.save(labelPO);
	}

	@Override
	public List<LabelVO> querylabelBytype(LabelVO labelVO) {
			
		List<LabelPO> labelPOs = labelDao.querylabelBytype(labelVO.getType());
		List<LabelVO> LabelVOs = new ArrayList<LabelVO>();
		
		for(LabelPO labelPO : labelPOs){
			
			LabelVO label = new LabelVO();
			
			BeanUtil.copyPropertie(labelPO, label);
			
			LabelVOs.add(label);
			
		}
		
		return LabelVOs;
	}

	
}
