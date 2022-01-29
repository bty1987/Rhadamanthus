package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.data.quotation.vo.PresignCostVO;

public interface PresignCostService {
	
	public List<PresignCostVO> queryPresignCost(PresignCostVO presignCost);
	
	public int addPresignCost(PresignCostVO presignCost);
	
	public int deletePresignCost(PresignCostVO presignCost);
}
