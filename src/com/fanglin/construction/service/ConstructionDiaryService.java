/**
 * @File Name	: ConstructionService.java
 * @Package   	: com.fanglin.service.construction
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionDiaryDrawingVO;
import com.fanglin.construction.vo.ConstructionDiaryVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionDiaryService {

	public void pageConstructionDiary(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public List<ConstructionDiaryVO> queryConstructionDiary(ConstructionDiaryVO constructionDiaryVO) throws FLException;

	public void addConstructionDiary(ConstructionDiaryVO constructionDiaryVO, ConstructionDiaryDrawingVO constructionDiaryDrawing, String userId, Integer company) throws FLException;

	public void enterConstructionDiary(Long csid) throws FLException;

	public void leaveConstructionDiary(Long csid) throws FLException;

}