package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.system.dao.SubFunctionDao;
import com.fanglin.system.po.SubFunctionPO;
import com.fanglin.system.service.SubFunctionService;
import com.fanglin.system.vo.SubFunctionVO;
import com.fanglin.utils.BeanUtil;

@Service("subFunctionService")
@Transactional(readOnly = true)
public class SubFunctionServiceImpl implements SubFunctionService {

	@Autowired
	private SubFunctionDao subFunctionDao;
	
	@Override
	public List<SubFunctionVO> querySubFunction(){
		List<SubFunctionPO> subFunctionPOs = subFunctionDao.querySubFunction();
		List<SubFunctionVO> subFunctionVOs = new ArrayList<SubFunctionVO>();
		
		for(SubFunctionPO subFunctionPO: subFunctionPOs){
			SubFunctionVO subFunctionVO = new SubFunctionVO();
			
			BeanUtil.copyProperties(subFunctionPO, subFunctionVO, Arrays.asList("function"));
			
			subFunctionVOs.add(subFunctionVO);
		}
		
		return subFunctionVOs;
	}
	
	@Override
	public SubFunctionVO querySubFunctionById(SubFunctionVO subFunctionVO){
		
		SubFunctionPO subFunctionPO = subFunctionDao.get(subFunctionVO.getSubFunctionId());
		
		BeanUtil.copyProperties(subFunctionPO, subFunctionVO, Arrays.asList("function"));
		
		return subFunctionVO;
	}
	
	@Override
	public List<SubFunctionVO> querySubFunctionByFunctionId(SubFunctionVO subFunctionVO){
		
		List<SubFunctionPO> subFunctionPOs = subFunctionDao.querySubFunctionByFunctionId(subFunctionVO.getFunction().getFunctionId());
		List<SubFunctionVO> subFunctionVOs = new ArrayList<SubFunctionVO>();
		
		for(SubFunctionPO subFunctionPO: subFunctionPOs){
			SubFunctionVO _subFunctionVO = new SubFunctionVO();
			
			BeanUtil.copyProperties(subFunctionPO, _subFunctionVO, Arrays.asList("function"));
			
			subFunctionVOs.add(_subFunctionVO);
		}
		
		return subFunctionVOs;
	}

	@Override
	public List<SubFunctionVO> querySubFunctionByIds(List<Integer> subFunctionIds){

		List<SubFunctionVO> subFunctionVOs = new ArrayList<SubFunctionVO>();
		for(Integer subFunctionId : subFunctionIds){
			
			SubFunctionVO subFunctionVO = querySubFunctionById(new SubFunctionVO(subFunctionId));
			
			if(subFunctionVO != null){
				subFunctionVOs.add(subFunctionVO);
			}
		}
		
		return subFunctionVOs;
	}
	
	@Override
	public List<SubFunctionVO> querySubFunctionLikeName(SubFunctionVO subFunctionVO){
		List<SubFunctionPO> subFunctionPOs = subFunctionDao.querySubFunctionLikeName(subFunctionVO.getSubFunctionName());
		
		List<SubFunctionVO> subFunctionVOs = new ArrayList<SubFunctionVO>();
		
		for(SubFunctionPO subFunctionPO: subFunctionPOs){
			SubFunctionVO _subFunctionVO = new SubFunctionVO();
			
			BeanUtil.copyProperties(subFunctionPO, _subFunctionVO, Arrays.asList("function"));
			
			subFunctionVOs.add(_subFunctionVO);
		}
		
		return subFunctionVOs;
	}
}
