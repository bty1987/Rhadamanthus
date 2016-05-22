package com.fanglin.system.vo;

import java.io.Serializable;
import java.util.List;

import com.google.gson.annotations.SerializedName;

public class TreeVO implements Serializable{
	                                                                
	private static final long serialVersionUID = 793543025076046420L;

	@SerializedName("编号")
	private int id;
	
	@SerializedName("名称")
	private String name;
	
	@SerializedName("url")
	private String url;
	
	@SerializedName("图标")
	private String icon;
	
	@SerializedName("子树")
	private List<TreeVO> sub;

	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	public String getName(){
		return name;
	}

	public void setName(String name){
		this.name = name;
	}

	public String getUrl(){
		return url;
	}

	public void setUrl(String url){
		this.url = url;
	}

	public String getIcon(){
		return icon;
	}

	public void setIcon(String icon){
		this.icon = icon;
	}

	public List<TreeVO> getSub(){
		return sub;
	}

	public void setSub(List<TreeVO> sub){
		this.sub = sub;
	}
}
