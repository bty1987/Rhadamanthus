package com.fanglin.communion.service;

import java.util.List;
import com.fanglin.communion.vo.DataDrawingVO;

public interface DataDrawingService {

	public List<DataDrawingVO> queryDataDrawing(DataDrawingVO dataDrawingVO);

	public void addDataDrawing(DataDrawingVO dataDrawingVO, String userId);

	public void deleteDataDrawing(DataDrawingVO dataDrawingVO);
}
