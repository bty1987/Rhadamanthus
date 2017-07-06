package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.ColorDao;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.service.ColorService;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.utils.BeanUtil;

@Service("colorService")
@Transactional(readOnly=true)
public class ColorServiceImpl implements ColorService{
	
	@Autowired
	private ColorDao colorDao;
	
	@Override
	public List<ColorVO> queryColorByGid(ColorVO colorVO) {
		
		List<ColorPO> colorPOs = colorDao.queryColorByGid(colorVO.getGid());
		List<ColorVO> colorVOs = new ArrayList<ColorVO>();
		
		for(ColorPO colorPO: colorPOs){
			
			colorVO = new ColorVO();
			
			BeanUtil.copyProperties(colorPO, colorVO);
			
			colorVOs.add(colorVO);
		}
		
		return colorVOs;
	}

	@Override
	public List<ColorVO> queryColorForEnableByGid(ColorVO colorVO) {
		
		List<ColorPO> colorPOs = colorDao.queryColorByGid(colorVO.getGid());
		List<ColorVO> colorVOs = new ArrayList<ColorVO>();
		
		for(ColorPO colorPO: colorPOs){
			
			if(colorPO.getStatus()==ColorPO.STATUS_ENABLE_INT){
				
				colorVO = new ColorVO();
				
				BeanUtil.copyProperties(colorPO, colorVO);
				
				colorVOs.add(colorVO);
			}
		}
		
		return colorVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addColor(ColorVO colorVO) throws FLException {
		
		ColorPO colorPO = new ColorPO();
		
		BeanUtil.copyProperties(colorVO, colorPO);
		
		colorPO.setStatus(ColorPO.STATUS_ENABLE_INT);
		
		colorDao.save(colorPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updataColorForStatus(ColorVO colorVO) throws FLException {
		
		ColorPO colorPO = colorDao.get(colorVO.getCid());
		
		if(colorPO == null){
			throw new FLException(260014, "颜色不存在");
		}
		
		colorPO.setStatus(colorVO.getStatus());
		
		colorDao.update(colorPO);
		
		return 0;
	}

}
