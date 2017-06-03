/**
 * @File Name		: CleaningDrawingVO.java
 * @Package   	: com.fanglin.vo.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class CleaningDrawingVO implements Serializable{

	private static final long serialVersionUID = 6352865797932189706L;
	
    private Integer cdId;
    
    private Integer ccsId;
    
    private Long csId;
    
    private String operatorName;
    
    private Timestamp operateTime;
    
    private String drawingName;
    
    private String drawingUrl;
    
    private String drawingAddUrl;
    
    private Short type;

	public Integer getCdId(){
		return cdId;
	}

	public void setCdId(Integer cdId){
		this.cdId = cdId;
	}

	public Integer getCcsId(){
		return ccsId;
	}

	public void setCcsId(Integer ccsId){
		this.ccsId = ccsId;
	}

	public String getDrawingName(){
		return drawingName;
	}

	public void setDrawingName(String drawingName){
		this.drawingName = drawingName;
	}

	public String getDrawingUrl(){
		return drawingUrl;
	}

	public void setDrawingUrl(String drawingUrl){
		this.drawingUrl = drawingUrl;
	}

	public String getDrawingAddUrl(){
		return drawingAddUrl;
	}

	public void setDrawingAddUrl(String drawingAddUrl){
		this.drawingAddUrl = drawingAddUrl;
	}

	public String getOperatorName(){
		return operatorName;
	}

	public void setOperatorName(String operatorName){
		this.operatorName = operatorName;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime(){
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime){
		this.operateTime = operateTime;
	}

	public Long getCsId() {
		return csId;
	}

	public void setCsId(Long csId) {
		this.csId = csId;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

}
