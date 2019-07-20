package com.fanglin.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.material.vo.MaterialActivityItemVO;
import com.fanglin.material.vo.MaterialVO;

public interface MaterialActivityService {
	
	public int addMaterialActivityItem(List<MaterialActivityItemVO> materialActivityItems) throws FLException;
	
	public List<MaterialActivityItemVO> queryMaterialActivityItem(String orderId);
	
	public Object queryMaterialActivity(String orderId);
	
	public int updateMaterialForActivity(MaterialVO materialVO) throws FLException;
	
	public int abateMaterialActivityItem(MaterialActivityItemVO materialActivityItemVO) throws FLException;

	public int receiveMaterialActivityItem(MaterialActivityItemVO materialActivityItemVO, String userId,String userName) throws FLException;

	public int deliveMaterialActivityItem(MaterialActivityItemVO materialActivityItemVO, String userId, String userName) throws FLException;

	public int unrefundMaterialActivityItem(MaterialActivityItemVO materialActivityItemVO) throws FLException;

	public int refundMaterialActivityItem(MaterialActivityItemVO materialActivityItemVO, String userId,String userName) throws FLException;

	public int expendMaterialActivityItem(MaterialActivityItemVO materialActivityItemVO) throws FLException;

}
